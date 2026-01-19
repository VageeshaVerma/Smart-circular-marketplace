def decide_action(
    predicted_resale_value: float,
    original_price: float,
    condition: str,
    age: int,
    category: str,
):
    resale_ratio = predicted_resale_value / original_price

    # 1️⃣ RESALE
    if (
        resale_ratio >= 0.4
        and condition == "Good"
        and age <= 5
        and category in ["Electronics", "Furniture"]
    ):
        return "Resell"

    # 2️⃣ REPAIR
    if resale_ratio >= 0.15:
        return "Repair"

    # 3️⃣ RECYCLE
    return "Recycle"
