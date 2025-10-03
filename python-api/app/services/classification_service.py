import pandas as pd


class ClassificationService:
    def somar_quantidade_por_segmento(df):
        # Agrupando por Linha, Processo e SKU e somando a quantidade.
        soma_segmentada = (
            df.groupby(["Familia", "Processo", "SKU"])["Quantidade"].sum().reset_index()
        )
        soma_segmentada = soma_segmentada.rename(
            columns={"Quantidade": "Quantidade_Total"}
        )
        return soma_segmentada

    def classificar_abc_segmentado(df_segmentado):
        resultados = []

        def classificar(percentual):
            if percentual <= 0.8:
                return "A"
            elif percentual <= 0.95:
                return "B"
            else:
                return "C"

        for (familia, processo), grupo in df_segmentado.groupby(
            ["Familia", "Processo"]
        ):
            grupo = grupo.sort_values(by="Quantidade_Total", ascending=False)
            total_geral = grupo["Quantidade_Total"].sum()

            grupo["Percentual_Acumulado"] = (
                grupo["Quantidade_Total"].cumsum() / total_geral
            )
            grupo["Classe_ABC"] = grupo["Percentual_Acumulado"].apply(classificar)

            grupo["Familia"] = familia
            grupo["Processo"] = processo

            resultados.append(grupo)

        df_classificado = pd.concat(resultados).reset_index(drop=True)
        return df_classificado
