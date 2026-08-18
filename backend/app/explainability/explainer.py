from typing import Dict, Any

def generate_scientific_interpretation(
    original_features: Dict[str, float],
    modified_features: Dict[str, float],
    original_pred: Dict[str, Any],
    modified_pred: Dict[str, Any]
) -> str:
    """
    Generates scientifically responsible explanation adhering strictly to 
    Controlled Intervention Evidence without claiming AI understanding or causality.
    """
    char_energy_before = original_features.get("char_band_energy", 0.0)
    char_energy_after = modified_features.get("char_band_energy", 0.0)
    
    if char_energy_before > 0:
        energy_pct_change = ((char_energy_after - char_energy_before) / char_energy_before) * 100.0
    else:
        energy_pct_change = 0.0
        
    fault_prob_before = original_pred.get("fault_probability", 0.0) * 100.0
    fault_prob_after = modified_pred.get("fault_probability", 0.0) * 100.0
    prob_delta_pts = fault_prob_after - fault_prob_before
    
    direction = "increased" if prob_delta_pts > 0 else ("decreased" if prob_delta_pts < 0 else "remained unchanged")
    energy_direction = "increased" if energy_pct_change > 0 else "decreased"
    
    statement = (
        f"Controlled intervention {energy_direction} the characteristic frequency-band energy (100-140 Hz) "
        f"by {abs(energy_pct_change):.1f}%. In response, the classifier's estimated fault probability "
        f"{direction} from {fault_prob_before:.1f}% to {fault_prob_after:.1f}% "
        f"({prob_delta_pts:+.1f} percentage points shift). "
        f"This experiment provides empirical evidence that the classifier output exhibits sensitivity "
        f"to the controlled physical feature intervention."
    )
    return statement
