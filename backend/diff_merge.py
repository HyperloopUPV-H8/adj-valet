from typing import Any, Dict

def merge_changes(original: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively update the original dictionary with the updates.
    Only fields present in updates will be overwritten.
    """
    def recursive_update(orig: Dict[str, Any], upd: Dict[str, Any]) -> Dict[str, Any]:
        for key, value in upd.items():
            if key in orig and isinstance(orig[key], dict) and isinstance(value, dict):
                recursive_update(orig[key], value)
            else:
                orig[key] = value
        return orig

    return recursive_update(original, updates)
