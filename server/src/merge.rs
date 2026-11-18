//! Merging two versions of the progress data.
//!
//! The progress of a learner only ever grows (exercises attempted, lessons finished, achievements unlocked), so two
//! devices that saved in parallel can always be reconciled without losing anything:
//! - objects are merged key by key (a key present on one side only is kept);
//! - numbers keep the larger value (counters never go backwards);
//! - anything else (text, booleans, arrays) takes the incoming value, except that an existing value is never replaced by `null`;
//! - the `prefs` object (sound on/off, theme…) is a plain setting: the incoming version wins as a whole.

use serde_json::{Map, Value};

/// Keys whose value is a setting rather than progress: the incoming version replaces the stored one.
const REPLACE_KEYS: &[&str] = &["prefs"];

pub fn merge(stored: &Value, incoming: &Value) -> Value {
    merge_at(stored, incoming, 0)
}

fn merge_at(stored: &Value, incoming: &Value, depth: usize) -> Value {
    match (stored, incoming) {
        (Value::Object(a), Value::Object(b)) => {
            let mut out: Map<String, Value> = a.clone();
            for (k, v) in b {
                let merged = match a.get(k) {
                    Some(old) if !(depth == 0 && REPLACE_KEYS.contains(&k.as_str())) => merge_at(old, v, depth + 1),
                    _ => v.clone(),
                };
                out.insert(k.clone(), merged);
            }
            Value::Object(out)
        }
        (Value::Number(a), Value::Number(b)) => {
            let (x, y) = (a.as_f64().unwrap_or(0.0), b.as_f64().unwrap_or(0.0));
            if x > y { Value::Number(a.clone()) } else { Value::Number(b.clone()) }
        }
        (old, Value::Null) => old.clone(),
        (_, new) => new.clone(),
    }
}

/// A rough size of the progress, used to take a safety snapshot before a save that would shrink it a lot.
pub fn weight(v: &Value) -> usize {
    match v {
        Value::Object(m) => m.values().map(weight).sum::<usize>() + m.len(),
        Value::Array(a) => a.iter().map(weight).sum::<usize>() + a.len(),
        _ => 1,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn keeps_keys_from_both_sides() {
        let a = json!({"attempts": {"e1": {"ok": 1}}, "ach": {"x": "2026-01-01"}});
        let b = json!({"attempts": {"e2": {"ok": 2}}, "ach": {"y": "2026-01-02"}});
        let m = merge(&a, &b);
        assert_eq!(m, json!({"attempts": {"e1": {"ok": 1}, "e2": {"ok": 2}}, "ach": {"x": "2026-01-01", "y": "2026-01-02"}}));
    }

    #[test]
    fn counters_never_go_backwards() {
        let a = json!({"attempts": {"e1": {"ok": 5, "ko": 1}}});
        let b = json!({"attempts": {"e1": {"ok": 3, "ko": 2}}});
        assert_eq!(merge(&a, &b), json!({"attempts": {"e1": {"ok": 5, "ko": 2}}}));
    }

    #[test]
    fn text_takes_incoming_but_null_never_erases() {
        let a = json!({"attempts": {"e1": {"last": "ko", "at": "t1"}}});
        let b = json!({"attempts": {"e1": {"last": "ok", "at": null}}});
        assert_eq!(merge(&a, &b), json!({"attempts": {"e1": {"last": "ok", "at": "t1"}}}));
    }

    #[test]
    fn prefs_are_replaced_as_a_whole() {
        let a = json!({"prefs": {"sound": true, "volume": 8}});
        let b = json!({"prefs": {"sound": false, "volume": 2}});
        assert_eq!(merge(&a, &b), json!({"prefs": {"sound": false, "volume": 2}}));
    }

    #[test]
    fn empty_incoming_changes_nothing() {
        let a = json!({"attempts": {"e1": {"ok": 1}}});
        assert_eq!(merge(&a, &json!({})), a);
    }

    #[test]
    fn weight_counts_entries() {
        assert!(weight(&json!({"a": {"b": 1, "c": 2}})) > weight(&json!({"a": {}})));
    }
}
