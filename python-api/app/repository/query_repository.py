from app.config.db_config import DatabaseConfig


class QueryRepository:
    def get_all_skus():
        query = "SELECT cdfamilia, cdproduto, cdprocesso, periodo, valor FROM tbdadosbruto WHERE periodo BETWEEN '2022-08-01' AND '2025-07-01' ORDER BY periodo;"
        df = DatabaseConfig.load_data_from_db(query)
        return df

    def get_unique_sku(sku=None):
        query = f"SELECT cdfamilia, cdproduto, cdprocesso, periodo, valor FROM tbdadosbruto WHERE cdproduto = '{sku}' AND periodo BETWEEN '2022-08-01' AND '2025-07-01' ORDER BY periodo;"
        df = DatabaseConfig.load_data_from_db(query)
        return df

    def get_validation_data():
        df = QueryRepository.get_all_skus()

        df_for_validation = (
            df.groupby("cdproduto")
            .apply(
                lambda group: group[["cdproduto", "periodo", "valor"]]
                .rename(columns={"periodo": "ds", "valor": "y", "cdproduto": "sku"})
                .reset_index(drop=True)
            )
            .reset_index(drop=True)
        )

        return df_for_validation
