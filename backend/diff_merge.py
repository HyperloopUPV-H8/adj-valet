from typing import Any, Dict

def deep_merge(original: Any, updates: Any) -> Any:
    if isinstance(original, dict) and isinstance(updates, dict):
        for key, value in updates.items():
            if key in original:
                original[key] = deep_merge(original[key], value)
            else:
                original[key] = value
        return original
    elif isinstance(original, list) and isinstance(updates, list):
        if original and isinstance(original[0], dict) and len(original[0]) == 1:
            orig_dict = {list(item.keys())[0]: item for item in original}
            for upd_item in updates:
                upd_key = list(upd_item.keys())[0]
                if upd_key in orig_dict:
                    orig_dict[upd_key] = deep_merge(orig_dict[upd_key], upd_item[upd_key])
                else:
                    orig_dict[upd_key] = upd_item[upd_key]
            return [{k: v} for k, v in orig_dict.items()]
        else:
            def get_id(item: Any):
                if isinstance(item, dict):
                    for key in ['id', 'packet_id']:
                        if key in item:
                            return item[key]
                return None

            orig_map = {}
            for item in original:
                item_id = get_id(item)
                if item_id is not None:
                    orig_map[item_id] = item

            for upd_item in updates:
                upd_id = get_id(upd_item)
                if upd_id is not None and upd_id in orig_map:
                    orig_map[upd_id] = deep_merge(orig_map[upd_id], upd_item)
                else:
                    original.append(upd_item)
            return original
    else:
        return updates

def merge_changes(original: Dict[str, Any], updates: Dict[str, Any]) -> Dict[str, Any]:
    return deep_merge(original, updates)
