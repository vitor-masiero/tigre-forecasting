from typing import List, Optional, Tuple

import pandas as pd


class AggregationService:
    @staticmethod
    def _prepare_data(df: pd.DataFrame) -> pd.DataFrame:
        duplicates = df.groupby(["SKU", "Data"]).size()
        has_duplicates = (duplicates > 1).any()

        if has_duplicates:
            df_clean = (
                df.groupby(["SKU", "Data", "Familia", "Processo"])["Quantidade"]
                .sum()
                .reset_index()
            )
        else:
            df_clean = df.copy()

        return df_clean

    @staticmethod
    def aggregate_combined(
        df: pd.DataFrame,
        df_classified: Optional[pd.DataFrame] = None,
        familia: Optional[List[str]] = None,
        processo: Optional[List[str]] = None,
        abc_class: Optional[List[str]] = None,
    ) -> Tuple[pd.DataFrame, dict]:
        df_clean = AggregationService._prepare_data(df)

        df_filtered = df_clean.copy()
        filters_applied = []

        if familia:
            df_filtered = df_filtered[df_filtered["Familia"].isin(familia)]
            if df_filtered.empty:
                raise ValueError(
                    f"Família(s) '{', '.join(familia)}' não encontrada(s) nos dados"
                )
            filters_applied.append(f"Familia={', '.join(familia)}")

        if processo:
            df_filtered = df_filtered[df_filtered["Processo"].isin(processo)]
            if df_filtered.empty:
                raise ValueError(
                    f"Processo(s) '{', '.join(processo)}' não encontrado(s) nos dados (após filtros anteriores)"
                )
            filters_applied.append(f"Processo={', '.join(processo)}")

        if abc_class:
            if df_classified is None:
                raise ValueError(
                    "df_classified é necessário quando abc_class é especificado"
                )

            abc_class_upper = [c.upper().strip() for c in abc_class]
            invalid_classes = [c for c in abc_class_upper if c not in ["A", "B", "C"]]
            if invalid_classes:
                raise ValueError(
                    f"Classe(s) ABC inválida(s): '{', '.join(invalid_classes)}'. Use A, B ou C"
                )

            skus_abc = df_classified[df_classified["Classe_ABC"].isin(abc_class_upper)][
                "SKU"
            ].unique()

            if len(skus_abc) == 0:
                raise ValueError(
                    f"Nenhum SKU encontrado para classe(s) ABC '{', '.join(abc_class_upper)}'"
                )

            df_filtered = df_filtered[df_filtered["SKU"].isin(skus_abc)]

            if df_filtered.empty:
                raise ValueError(
                    f"Nenhum dado encontrado para classe(s) ABC '{', '.join(abc_class_upper)}' (após filtros anteriores)"
                )

            filters_applied.append(f"ABC={', '.join(abc_class_upper)}")

        df_aggregated = df_filtered.groupby("Data")["Quantidade"].sum().reset_index()

        info = {
            "type": "combined",
            "filters": filters_applied,
            "skus_count": df_filtered["SKU"].nunique(),
            "total_quantity": df_filtered["Quantidade"].sum(),
            "date_range": {
                "start": str(df_filtered["Data"].min()),
                "end": str(df_filtered["Data"].max()),
            },
        }

        if familia:
            info["familia"] = familia
        if processo:
            info["processo"] = processo
        if abc_class:
            info["abc_class"] = abc_class

        info["familias_included"] = df_filtered["Familia"].unique().tolist()
        info["processos_included"] = df_filtered["Processo"].unique().tolist()

        return df_aggregated, info

    @staticmethod
    def aggregate_familia(
        df: pd.DataFrame, familia: Optional[List[str]] = None
    ) -> Tuple[pd.DataFrame, dict]:
        df_clean = AggregationService._prepare_data(df)

        if familia:
            df_filtered = df_clean[df_clean["Familia"].isin(familia)].copy()
            if df_filtered.empty:
                raise ValueError(
                    f"Família(s) '{', '.join(familia)}' não encontrada(s) nos dados"
                )

            skus_list = df_filtered["SKU"].unique().tolist()
            info = {
                "type": "familia",
                "familia": familia,
                "skus_count": len(skus_list),
                "processos": df_filtered["Processo"].unique().tolist(),
                "skus": skus_list[:10],
            }
        else:
            df_filtered = df_clean.copy()
            info = {
                "type": "all_familias",
                "familias": df_clean["Familia"].unique().tolist(),
                "skus_count": df_clean["SKU"].nunique(),
            }

        df_aggregated = df_filtered.groupby("Data")["Quantidade"].sum().reset_index()

        return df_aggregated, info

    @staticmethod
    def aggregate_by_processo(
        df: pd.DataFrame, processo: Optional[List[str]] = None
    ) -> Tuple[pd.DataFrame, dict]:
        df_clean = AggregationService._prepare_data(df)

        if processo:
            df_filtered = df_clean[df_clean["Processo"].isin(processo)].copy()
            if df_filtered.empty:
                raise ValueError(
                    f"Processo(s) '{', '.join(processo)}' não encontrado(s) nos dados"
                )

            skus_list = df_filtered["SKU"].unique().tolist()
            info = {
                "type": "processo",
                "processo": processo,
                "skus_count": len(skus_list),
                "familias": df_filtered["Familia"].unique().tolist(),
                "skus": skus_list[:10],
            }
        else:
            df_filtered = df_clean.copy()
            info = {
                "type": "all_processos",
                "processos": df_clean["Processo"].unique().tolist(),
                "skus_count": df_clean["SKU"].nunique(),
            }

        df_aggregated = df_filtered.groupby("Data")["Quantidade"].sum().reset_index()

        return df_aggregated, info

    @staticmethod
    def aggregate_by_abc(
        df: pd.DataFrame, df_classified: pd.DataFrame, abc_class: List[str]
    ) -> Tuple[pd.DataFrame, dict]:
        abc_class_upper = [c.upper().strip() for c in abc_class]
        invalid_classes = [c for c in abc_class_upper if c not in ["A", "B", "C"]]
        if invalid_classes:
            raise ValueError(
                f"Classe(s) ABC inválida(s): '{', '.join(invalid_classes)}'. Use A, B ou C"
            )

        df_clean = AggregationService._prepare_data(df)

        skus_abc = df_classified[df_classified["Classe_ABC"].isin(abc_class_upper)][
            "SKU"
        ].unique()

        if len(skus_abc) == 0:
            raise ValueError(
                f"Nenhum SKU encontrado para classe(s) ABC '{', '.join(abc_class_upper)}'"
            )

        df_filtered = df_clean[df_clean["SKU"].isin(skus_abc)].copy()

        if df_filtered.empty:
            raise ValueError(
                f"Nenhum dado encontrado para classe(s) ABC '{', '.join(abc_class_upper)}'"
            )

        df_aggregated = df_filtered.groupby("Data")["Quantidade"].sum().reset_index()

        info = {
            "type": "abc",
            "abc_class": abc_class_upper,
            "skus_count": len(skus_abc),
            "familias": df_filtered["Familia"].unique().tolist(),
            "processos": df_filtered["Processo"].unique().tolist(),
            "skus": skus_abc.tolist()[:10],
        }

        return df_aggregated, info

    @staticmethod
    def aggregate_all(df: pd.DataFrame) -> Tuple[pd.DataFrame, dict]:
        df_clean = AggregationService._prepare_data(df)

        df_aggregated = df_clean.groupby("Data")["Quantidade"].sum().reset_index()

        info = {
            "type": "all",
            "skus_count": df_clean["SKU"].nunique(),
            "familias": df_clean["Familia"].unique().tolist(),
            "processos": df_clean["Processo"].unique().tolist(),
            "total_quantity": df_clean["Quantidade"].sum(),
        }

        return df_aggregated, info
