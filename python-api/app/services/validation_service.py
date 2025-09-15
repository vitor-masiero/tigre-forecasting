

def wmape(y_true, y_pred):
    """
    Weighted Mean Absolute Percentage Error
    """
    return np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100