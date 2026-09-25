def calculate_risk(prediction: str, confidence: float, visual_change: bool = False, questionnaire_score: int = 0, spread_percentage: float = 0.0):
    """
    Smart Risk Engine. Combines inputs to output a risk score and flag.
    Note: This is a hackathon prototype, NOT a medical diagnosis system.
    """
    score = 0
    reasons = []

    # 1. AI model signal
    if "Melanoma" in prediction or "SCC" in prediction or "Squamous" in prediction:
        score += 55 + (25 * confidence)
        reasons.append("Strong model signal for atypical/malignant patterns.")
    elif "BCC" in prediction or "Basal cell" in prediction or "ACK" in prediction:
        score += 40 + (20 * confidence)
        reasons.append("Model detected suspicious structural patterns.")
    elif "Rash" in prediction or "Allergy" in prediction:
        score += 20 + (15 * confidence)
        reasons.append("Model detected inflammatory rash/allergy patterns.")
    elif "Normal" in prediction or "Clear" in prediction:
        score += 0
        reasons.append("Model detected standard baseline skin attributes without notable lesions.")
    else:
        score += 10 + (10 * confidence)
        reasons.append("Model signal corresponds to common benign conditions (Nevus/Seborrheic).")

    # 2. visual change (Weight: ~20%)
    if visual_change:
        score += 20
        reasons.append("Recent visual change reported or detected.")

    # 3. Questionnaire responses (Weight: ~25%)
    score += min(25, questionnaire_score * 5)
    if questionnaire_score > 2:
        reasons.append("Multiple concerning questionnaire responses.")

    # 4. Main Rule: Spatial Spread Evaluation dominates the flags (UNLESS skin is perfectly Normal)
    if "Normal" not in prediction and "Clear" not in prediction:
        if spread_percentage > 50.0:
            score = max(score, 80)
            reasons.append(f"Massive spread ({spread_percentage:.1f}% coverage) - guaranteed HIGH flag.")
        elif spread_percentage >= 30.0:
            if score < 65:  # Don't downgrade existing cancer
                score = max(score, 50)
                reasons.append(f"Moderate spread ({spread_percentage:.1f}% coverage) - guaranteed MODERATE flag.")
        elif spread_percentage <= 20.0:
            if "Melanoma" not in prediction and "SCC" not in prediction and "BCC" not in prediction:
                score = min(score, 30)
                reasons.append(f"Minimal spread ({spread_percentage:.1f}% coverage) on non-malignant spot - forced LOW flag.")

    # Generate Flag
    if score <= 35:
        flag = "LOW"
    elif score <= 65:
        flag = "MODERATE"
    else:
        flag = "HIGH"

    return {
        "risk_score": round(score, 1),
        "risk_flag": flag,
        "reasons": reasons
    }
