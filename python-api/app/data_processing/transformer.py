import numpy as np
import pandas as pd


class DataTransformer:
    """
    Classe para preprocessamento de dados de vendas.
    Trata colunas, datas, outliers e transformações.
    """

    def __init__(self, outlier_method='iqr', outlier_threshold=1.5, apply_log=False, verbose=True):
        """
        Args:
            outlier_method: Método de tratamento ('iqr', 'mad', 'percentile', 'zscore', 'winsorize', 'none')
            outlier_threshold: Threshold para detecção (1.5 para IQR, 3.0 para zscore)
            apply_log: Se True, aplica transformação logarítmica
            verbose: Se True, exibe logs detalhados
        """
        self.outlier_method = outlier_method
        self.outlier_threshold = outlier_threshold
        self.apply_log = apply_log
        self.verbose = verbose
        self.outlier_stats = {}

    def preprocess(self, df):
        """Pipeline completo de preprocessamento"""
        df = df.copy()

        # 1. Converte coluna periodo para datetime
        df["Data"] = pd.to_datetime(df["periodo"])

        # 2. Renomeia colunas para padrão
        df = df.rename(
            columns={
                "cdproduto": "SKU",
                "valor": "Quantidade",
                "cdfamilia": "Familia",
                "cdprocesso": "Processo",
            }
        )

        df = df[["SKU", "Data", "Quantidade", "Familia", "Processo"]]

        # 3. Garante tipo numérico
        df["Quantidade"] = pd.to_numeric(df["Quantidade"], errors="coerce").fillna(0)

        # 4. Remove outliers (se método não for 'none')
        if self.outlier_method != 'none':
            df = self.remove_outliers(df, method=self.outlier_method)

        # 5. Aplica transformação logarítmica (opcional)
        if self.apply_log:
            df = self.log_transform(df)

        return df

    def remove_outliers(self, df, method=None):
        """
        Remove outliers usando método especificado.
        
        Args:
            df: DataFrame com dados
            method: Método de detecção ('iqr', 'mad', 'percentile', 'zscore', 'winsorize')
        
        Returns:
            DataFrame com outliers tratados
        """
        if method is None:
            method = self.outlier_method

        if self.verbose:
            print(f"🔍 Tratando outliers (método: {method})...")
            print(f"   📊 Estatísticas antes: min={df['Quantidade'].min():.2f}, max={df['Quantidade'].max():.2f}, média={df['Quantidade'].mean():.2f}, std={df['Quantidade'].std():.2f}")

        df = df.copy()
        
        # Detecta se há múltiplos SKUs
        num_skus = df['SKU'].nunique()
        
        if method == 'iqr':
            df = self._remove_outliers_iqr(df, group_by_sku=(num_skus > 1))
        elif method == 'mad':
            df = self._remove_outliers_mad(df, group_by_sku=(num_skus > 1))
        elif method == 'percentile':
            df = self._remove_outliers_percentile(df, group_by_sku=(num_skus > 1))
        elif method == 'zscore':
            df = self._remove_outliers_zscore(df, group_by_sku=(num_skus > 1))
        elif method == 'winsorize':
            df = self._remove_outliers_winsorize(df, group_by_sku=(num_skus > 1))
        else:
            raise ValueError(f"Método '{method}' não reconhecido. Use: 'iqr', 'mad', 'percentile', 'zscore', 'winsorize'")

        if self.verbose:
            print(f"   📊 Estatísticas depois: min={df['Quantidade'].min():.2f}, max={df['Quantidade'].max():.2f}, média={df['Quantidade'].mean():.2f}, std={df['Quantidade'].std():.2f}")

        return df

    def _remove_outliers_iqr(self, df, group_by_sku=True):
        """Método IQR (Interquartile Range) - Padrão e robusto"""
        original_values = df["Quantidade"].copy()
        
        if group_by_sku:
            # Múltiplos SKUs: agrupa por SKU
            q1 = df.groupby("SKU")["Quantidade"].transform(lambda x: x.quantile(0.25))
            q3 = df.groupby("SKU")["Quantidade"].transform(lambda x: x.quantile(0.75))
        else:
            # SKU único: calcula direto na série
            q1 = df["Quantidade"].quantile(0.25)
            q3 = df["Quantidade"].quantile(0.75)
        
        iqr = q3 - q1
        lower = np.maximum(0, q1 - self.outlier_threshold * iqr)
        upper = q3 + self.outlier_threshold * iqr

        # Conta outliers antes do tratamento
        outliers_mask = (df["Quantidade"] < lower) | (df["Quantidade"] > upper)
        num_outliers = outliers_mask.sum()
        
        # Aplica capping
        df["Quantidade"] = df["Quantidade"].clip(lower=lower, upper=upper)
        
        # Calcula mudança real
        valores_alterados = (original_values != df["Quantidade"]).sum()

        if self.verbose:
            lower_val = float(lower) if isinstance(lower, (int, float)) else lower.min()
            upper_val = float(upper) if isinstance(upper, (int, float)) else upper.max()
            q1_val = float(q1) if isinstance(q1, (int, float)) else q1.min()
            q3_val = float(q3) if isinstance(q3, (int, float)) else q3.max()
            iqr_val = float(iqr) if isinstance(iqr, (int, float)) else iqr.min()
            
            print(f"   📈 Q1={q1_val:.2f}, Q3={q3_val:.2f}, IQR={iqr_val:.2f}")
            print(f"   🎯 Limites: [{lower_val:.2f}, {upper_val:.2f}]")
            
            if valores_alterados > 0:
                print(f"   ✅ IQR: {valores_alterados} valores alterados ({valores_alterados/len(df)*100:.1f}%)")
            else:
                print(f"   ℹ️  IQR: Nenhum valor fora dos limites")

        self.outlier_stats['method'] = 'iqr'
        self.outlier_stats['num_outliers'] = valores_alterados
        self.outlier_stats['percentage'] = valores_alterados/len(df)*100

        return df

    def _remove_outliers_mad(self, df, group_by_sku=True):
        """Método MAD (Median Absolute Deviation) - Muito robusto"""
        original_values = df["Quantidade"].copy()
        
        if group_by_sku:
            def mad_treatment(series):
                median = series.median()
                mad = np.median(np.abs(series - median))
                
                if mad == 0:
                    # Se MAD = 0, usa percentil como fallback
                    upper = series.quantile(0.90)
                    return series.clip(upper=upper)
                
                # Modified Z-Score (mais sensível que o padrão)
                modified_z = 0.6745 * (series - median) / mad
                outliers_mask = np.abs(modified_z) > 2.5  # Threshold mais baixo (era 3.5)
                
                # Substitui outliers pela mediana
                series_clean = series.copy()
                series_clean[outliers_mask] = median
                
                return series_clean
            
            df["Quantidade"] = df.groupby("SKU")["Quantidade"].transform(mad_treatment)
        else:
            median = df["Quantidade"].median()
            mad = np.median(np.abs(df["Quantidade"] - median))
            
            if mad == 0:
                # Fallback: usa percentil 90
                upper = df["Quantidade"].quantile(0.90)
                df["Quantidade"] = df["Quantidade"].clip(upper=upper)
                print(f"   ⚠️  MAD=0, usando percentil 90: {upper:.2f}")
            else:
                # Modified Z-Score
                modified_z = 0.6745 * (df["Quantidade"] - median) / mad
                outliers_mask = np.abs(modified_z) > 2.5
                
                df.loc[outliers_mask, "Quantidade"] = median
                
                print(f"   📈 Mediana={median:.2f}, MAD={mad:.2f}")
        
        valores_alterados = (original_values != df["Quantidade"]).sum()

        if self.verbose:
            if valores_alterados > 0:
                print(f"   ✅ MAD: {valores_alterados} valores alterados ({valores_alterados/len(df)*100:.1f}%)")
            else:
                print(f"   ℹ️  MAD: Nenhum outlier detectado")

        self.outlier_stats['method'] = 'mad'
        self.outlier_stats['num_outliers'] = valores_alterados

        return df

    def _remove_outliers_percentile(self, df, group_by_sku=True):
        """Método Percentile Capping - Limita valores extremos"""
        # Percentis mais agressivos para construção civil
        lower_percentile = 5   # Remove 5% inferiores
        upper_percentile = 90  # Remove 10% superiores (era 95)
        
        original_values = df["Quantidade"].copy()

        if group_by_sku:
            def percentile_cap(series):
                lower = series.quantile(lower_percentile / 100)
                upper = series.quantile(upper_percentile / 100)
                return series.clip(lower=lower, upper=upper)
            
            df["Quantidade"] = df.groupby("SKU")["Quantidade"].transform(percentile_cap)
        else:
            lower = df["Quantidade"].quantile(lower_percentile / 100)
            upper = df["Quantidade"].quantile(upper_percentile / 100)
            df["Quantidade"] = df["Quantidade"].clip(lower=lower, upper=upper)
            
            print(f"   🎯 Limites: [{lower:.2f}, {upper:.2f}] (p{lower_percentile}-p{upper_percentile})")
        
        num_capped = (original_values != df["Quantidade"]).sum()

        if self.verbose:
            if num_capped > 0:
                print(f"   ✅ Percentile: {num_capped} valores limitados ({num_capped/len(df)*100:.1f}%)")
            else:
                print(f"   ℹ️  Percentile: Nenhum valor fora dos limites")

        self.outlier_stats['method'] = 'percentile'
        self.outlier_stats['num_outliers'] = num_capped
        self.outlier_stats['percentage'] = num_capped/len(df)*100

        return df

    def _remove_outliers_zscore(self, df, group_by_sku=True):
        """Método Z-Score - Para dados normalmente distribuídos"""
        original_values = df["Quantidade"].copy()
        
        if group_by_sku:
            def zscore_treatment(series):
                mean = series.mean()
                std = series.std()
                
                if std == 0:
                    return series
                
                z_scores = np.abs((series - mean) / std)
                outliers_mask = z_scores > self.outlier_threshold
                
                # Substitui outliers pela mediana (mais robusto que média)
                median = series.median()
                series_clean = series.copy()
                series_clean[outliers_mask] = median
                
                return series_clean
            
            df["Quantidade"] = df.groupby("SKU")["Quantidade"].transform(zscore_treatment)
        else:
            mean = df["Quantidade"].mean()
            std = df["Quantidade"].std()
            
            if std > 0:
                z_scores = np.abs((df["Quantidade"] - mean) / std)
                outliers_mask = z_scores > self.outlier_threshold
                
                median = df["Quantidade"].median()
                df.loc[outliers_mask, "Quantidade"] = median
                
                print(f"   📈 Média={mean:.2f}, Std={std:.2f}, Threshold Z={self.outlier_threshold}")

        valores_alterados = (original_values != df["Quantidade"]).sum()

        if self.verbose:
            if valores_alterados > 0:
                print(f"   ✅ Z-Score: {valores_alterados} valores alterados ({valores_alterados/len(df)*100:.1f}%)")
            else:
                print(f"   ℹ️  Z-Score: Nenhum outlier detectado")

        self.outlier_stats['method'] = 'zscore'
        self.outlier_stats['num_outliers'] = valores_alterados

        return df

    def _remove_outliers_winsorize(self, df, group_by_sku=True):
        """
        Método Winsorize - MAIS AGRESSIVO
        Substitui valores extremos pelos percentis 10 e 90
        Ideal para séries com alta variabilidade natural
        """
        original_values = df["Quantidade"].copy()
        
        lower_percentile = 10  # Percentil inferior
        upper_percentile = 90  # Percentil superior

        if group_by_sku:
            def winsorize_treatment(series):
                lower = series.quantile(lower_percentile / 100)
                upper = series.quantile(upper_percentile / 100)
                
                # Substitui valores abaixo do p10 pelo p10
                # Substitui valores acima do p90 pelo p90
                series_clean = series.copy()
                series_clean[series < lower] = lower
                series_clean[series > upper] = upper
                
                return series_clean
            
            df["Quantidade"] = df.groupby("SKU")["Quantidade"].transform(winsorize_treatment)
        else:
            lower = df["Quantidade"].quantile(lower_percentile / 100)
            upper = df["Quantidade"].quantile(upper_percentile / 100)
            
            df.loc[df["Quantidade"] < lower, "Quantidade"] = lower
            df.loc[df["Quantidade"] > upper, "Quantidade"] = upper
            
            print(f"   🎯 Winsorize: p{lower_percentile}={lower:.2f}, p{upper_percentile}={upper:.2f}")
        
        valores_alterados = (original_values != df["Quantidade"]).sum()

        if self.verbose:
            if valores_alterados > 0:
                print(f"   ✅ Winsorize: {valores_alterados} valores alterados ({valores_alterados/len(df)*100:.1f}%)")
            else:
                print(f"   ℹ️  Winsorize: Nenhum valor fora dos limites")

        self.outlier_stats['method'] = 'winsorize'
        self.outlier_stats['num_outliers'] = valores_alterados
        self.outlier_stats['percentage'] = valores_alterados/len(df)*100

        return df

    def log_transform(self, df, quantity_col="Quantidade"):
        """
        Aplica transformação logarítmica para estabilizar variância.
        Útil para séries com crescimento exponencial ou alta variabilidade.
        """
        df = df.copy()
        df["Quantidade_Original"] = df[quantity_col]
        df["Quantidade"] = np.log1p(df[quantity_col])  # log(1 + x) para evitar log(0)
        
        if self.verbose:
            print(f"   ✅ Transformação logarítmica aplicada")
        
        return df

    def inverse_log_transform(self, df, quantity_col="Quantidade"):
        """Reverte transformação logarítmica"""
        df = df.copy()
        df[quantity_col] = np.expm1(df[quantity_col])  # exp(x) - 1
        return df

    def get_outlier_stats(self):
        """Retorna estatísticas do tratamento de outliers"""
        return self.outlier_stats


# ============================================================================
# FUNÇÕES DE CONVENIÊNCIA PARA PIPELINE
# ============================================================================

def preprocess_data(df, outlier_method='iqr', outlier_threshold=1.5, apply_log=False, verbose=False):
    """
    Função de conveniência para preprocessamento padrão.
    
    Args:
        df: DataFrame bruto do banco
        outlier_method: 'iqr', 'mad', 'percentile', 'zscore', 'winsorize', 'none'
        outlier_threshold: Threshold para detecção (1.5 para IQR, 3.0 para zscore)
        apply_log: Se True, aplica transformação logarítmica
        verbose: Se True, exibe logs detalhados
    
    Returns:
        DataFrame preprocessado
    """
    transformer = DataTransformer(
        outlier_method=outlier_method,
        outlier_threshold=outlier_threshold,
        apply_log=apply_log,
        verbose=verbose
    )
    return transformer.preprocess(df)


def preprocess_data_for_validation(df, outlier_method='winsorize', outlier_threshold=1.5):
    """
    Preprocessamento otimizado para validação (sem log transform).
    PADRÃO: winsorize (mais agressivo para construção civil)
    
    Args:
        df: DataFrame bruto
        outlier_method: Método de tratamento de outliers
        outlier_threshold: Threshold para detecção
    
    Returns:
        DataFrame preprocessado para validação
    """
    return preprocess_data(
        df,
        outlier_method=outlier_method,
        outlier_threshold=outlier_threshold,
        apply_log=False,  # Não usa log em validação
        verbose=True
    )


def preprocess_data_conservative(df):
    """Preprocessamento conservador (menos agressivo com outliers)"""
    return preprocess_data(df, outlier_method='iqr', outlier_threshold=2.0, verbose=True)


def preprocess_data_aggressive(df):
    """Preprocessamento agressivo (mais rigoroso com outliers) - RECOMENDADO TIGRE"""
    return preprocess_data(df, outlier_method='winsorize', verbose=True)