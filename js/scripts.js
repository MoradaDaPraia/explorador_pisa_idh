const elementos = {
    divSelecoesContainer: document.getElementById('selecoesContainer'),
    botaoAdicionarNovaLinha: document.getElementById('adicionar'),
};

const dados = {
    paises: { ALB: 'Albânia', DEU: 'Alemanha', SAU: 'Arábia Saudita', DZA: 'Argélia', ARG: 'Argentina', AUS: 'Austrália', AUT: 'Áustria', AZE: 'Azerbaijão', BEL: 'Bélgica', BLR: 'Bielorrússia', BIH: 'Bósnia e Herzegovina', BRA: 'Brasil', BRN: 'Brunei', BGR: 'Bulgária', KHM: 'Camboja', CAN: 'Canadá', QAT: 'Catar', KAZ: 'Cazaquistão', CHL: 'Chile', CHN: 'China', CYP: 'Chipre', COL: 'Colômbia', KOR: 'Coreia do Sul', CRI: 'Costa Rica', HRV: 'Croácia', DNK: 'Dinamarca', SLV: 'El Salvador', ARE: 'Emirados Árabes Unidos', SVK: 'Eslováquia', SVN: 'Eslovênia', ESP: 'Espanha', USA: 'Estados Unidos', EST: 'Estônia', PHL: 'Filipinas', FIN: 'Finlândia', FRA: 'França', GEO: 'Geórgia', GRC: 'Grécia', GTM: 'Guatemala', HKG: 'Hong Kong', HUN: 'Hungria', IDN: 'Indonésia', IRL: 'Irlanda', ISL: 'Islândia', ISR: 'Israel', ITA: 'Itália', JAM: 'Jamaica', JPN: 'Japão', JOR: 'Jordânia', XKX: 'Kosovo', LVA: 'Letônia', LBN: 'Líbano', LTU: 'Lituânia', LUX: 'Luxemburgo', MAC: 'Macau', MKD: 'Macedônia', MYS: 'Malásia', MLT: 'Malta', MAR: 'Marrocos', ECD: 'Média Internacional (OCDE)', MEX: 'México', MDA: 'Moldávia', MNG: 'Mongólia', MNE: 'Montenegro', NOR: 'Noruega', NZL: 'Nova Zelândia', NLD: 'Países Baixos', PSE: 'Palestina', PAN: 'Panamá', PRY: 'Paraguai', PER: 'Peru', POL: 'Polônia', PRT: 'Portugal', GBR: 'Reino Unido', DOM: 'República Dominicana', CZE: 'República Tcheca', ROU: 'Romênia', RUS: 'Rússia', SRB: 'Sérvia', SGP: 'Singapura', SWE: 'Suécia', CHE: 'Suíça', THA: 'Tailândia', TWN: 'Taiwan', TTO: 'Trindade e Tobago', TUN: 'Tunísia', TUR: 'Turquia', UKR: 'Ucrânia', URY: 'Uruguai', UZB: 'Uzbequistão', VNM: 'Vietnã' },
    indicadores: {
        expected_schooling_years: "Anos Esperados na Escola",
        human_development_index: "Índice de Desenvolvimento Humano",
        income_per_capita: "Renda Per Capita",
        mean_schooling_years: "Média de Anos na Escola",
        pisa_math: "PISA - Matemática",
        pisa_reading: "PISA - Leitura",
        pisa_science: "PISA - Ciência",
    },
    dataset: JSON.parse(__dataset__),
};

const renderizarGrafico = () => {
    const renderizados = [];
    elementos.divSelecoesContainer
        .querySelectorAll(".selecao")
        .forEach((selecao) => {
            const selectAbrangencia = selecao.querySelector("select[name='abrangencia']");  
            const selectIndicador = selecao.querySelector("select[name='indicador']");  
            
            if (!selectAbrangencia.value.trim() || !selectIndicador.value.trim()) {
                return;
            } 

            const codigoPais = selectAbrangencia.value.trim();
            const indicador = selectIndicador.value.trim();
            renderizados.push([codigoPais, indicador]);
        });

    const renderizacoes = {};
    for (const [codigoPais, indicador] of renderizados) {
        renderizacoes[`${codigoPais}-${indicador}`] = {
            nome: `${dados.paises[codigoPais]} - ${dados.indicadores[indicador]}`,
            coordenadas: dados.dataset
                .filter((item) => item.country_code === codigoPais && item[indicador] != null)
                .map((item) => [item.year, item[indicador]]),
        };
    }

    const traces = Object.values(renderizacoes).map((renderizacao) => ({
        x: renderizacao.coordenadas.map((item) => item[0]), 
        y: renderizacao.coordenadas.map((item) => item[1]), 
        name: renderizacao.nome,
        type: 'scatter',
    }));

    const layout = {
        showlegend: true,
        legend: {
            x: 0,
            xanchor: 'left',
            y: 1,
        },
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
        },
        xaxis: {
            ticklabelposition: "inside",
            ticks: "inside"
        },
        yaxis: {
            ticklabelposition: "inside",
            ticks: "inside"
        }
    };

    Plotly.newPlot('grafico', traces, layout, { responsive: true });
};

const aplicarEventosNaSelecao = (selecao) => {
    selecao.querySelector(".remover").addEventListener("click", (e) => {
        elementos.divSelecoesContainer.removeChild(e.target.parentNode);
        renderizarGrafico();
    });

    selecao.querySelectorAll("select")
        .forEach((element) => element.addEventListener("change", renderizarGrafico));
};

const adicionarSelecao = () => {
    const novaSelecao = document.createElement('div');
    novaSelecao.classList.add('selecao');
    novaSelecao.innerHTML = ` 
        <label>Abrangência:
            <select name="abrangencia">
                ${(() => {
                    let opcoes = '<option value="">Selecione um país...</option>';
                    for (const [codigo, nome] of Object.entries(dados.paises)) {
                        opcoes += `<option value="${codigo}">${nome}</option>`;
                    }
                    return opcoes;
                })()}
            </select>
        </label>

        <label for="indicador">Indicador:
            <select name="indicador">
                ${(() => {
                    let opcoes = '<option value="">Selecione um indicador...</option>';
                    for (const [campo, nome] of Object.entries(dados.indicadores)) {
                        opcoes += `<option value="${campo}">${nome}</option>`;
                    }
                    return opcoes;
                })()}
            </select>
        </label>

        <button class="remover">Remover</button>
    `;

    aplicarEventosNaSelecao(novaSelecao);

    elementos.divSelecoesContainer.appendChild(novaSelecao);
};

const main = () => {
    elementos.botaoAdicionarNovaLinha.addEventListener('click', adicionarSelecao);

    renderizarGrafico();
};

main();
