from typing import Any, Dict


def deep_merge(original: Any, updates: Any) -> Any:
    # If the update itself is None, skip merging
    if updates is None:
        return original

    # 1) Dict vs dict: merge recursively, skipping None values
    if isinstance(original, dict) and isinstance(updates, dict):
        for key, value in updates.items():
            if value is None:
                # skip null updates so we don't overwrite valid originals
                continue
            if key in original:
                original[key] = deep_merge(original[key], value)
            else:
                original[key] = value
        return original

    # 2) List vs list: handle wrappers or ID-based items
    elif isinstance(original, list) and isinstance(updates, list):
        # a) single-key dict wrappers (e.g., boards)
        if original and isinstance(original[0], dict) and len(original[0]) == 1:
            orig_map = {list(item.keys())[0]: item for item in original}
            for upd_item in updates:
                if not isinstance(upd_item, dict) or not upd_item:
                    continue
                key = list(upd_item.keys())[0]
                if key in orig_map:
                    orig_map[key] = deep_merge(orig_map[key], upd_item)
                else:
                    orig_map[key] = upd_item
            return [{k: v} for k, v in orig_map.items()]

        # b) ID-based list items
        def get_id(item: Any):
            if isinstance(item, dict):
                for k in ("id", "packet_id"):
                    if k in item:
                        return item[k]
            return None

        # build index of hashable IDs
        orig_map: Dict[Any, Any] = {}
        for item in original:
            uid = get_id(item)
            if uid is None:
                continue
            try:
                orig_map[uid] = item
            except TypeError:
                continue

        merged = list(original)
        for upd_item in updates:
            uid = get_id(upd_item)
            # skip null or invalid updates
            if upd_item is None or uid is None:
                continue
            if uid in orig_map:
                orig_map[uid] = deep_merge(orig_map[uid], upd_item)
            else:
                merged.append(upd_item)
        return merged

    # 3) Primitives: attempt best-effort type preservation
    else:
        # boolean coercion
        if isinstance(original, bool) and isinstance(updates, str):
            low = updates.lower().strip()
            if low in ("true", "1", "yes", "on"):
                return True
            if low in ("false", "0", "no", "off"):
                return False

        # integer coercion
        if isinstance(original, int) and isinstance(updates, str):
            try:
                return int(updates.strip(), 0)
            except ValueError:
                pass

        # float coercion
        if isinstance(original, float) and isinstance(updates, str):
            try:
                return float(updates.strip())
            except ValueError:
                pass

        # otherwise, overwrite
        return updates


def merge_changes(original: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
    return deep_merge(original, updates)
