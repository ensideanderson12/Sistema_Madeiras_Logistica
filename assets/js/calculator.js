// Advanced Calculator Module for Transparency and Profit Sharing
class TransparencyCalculator {
    constructor() {
        this.defaultValues = {
            volume: 52,
            basePrice: 1060,
            distance: 1319,
            freight: 11000,
            transparentMargin: 15,
            supplierShare: 70
        };
        
        this.scenarios = [];
        this.comparisonChart = null;
    }

    init() {
        this.setupCalculatorEvents();
        this.loadSavedScenarios();
    }

    setupCalculatorEvents() {
        document.addEventListener('change', (e) => {
            if (e.target.closest('#calculadora')) {
                this.validateInputs();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.closest('#calculadora')) {
                this.updateRealTimeCalculation();
            }
        });
    }

    validateInputs() {
        const inputs = {
            volume: document.getElementById('volume-fornecedor'),
            basePrice: document.getElementById('preco-base'),
            distance: document.getElementById('distancia'),
            freight: document.getElementById('custo-frete'),
            margin: document.getElementById('margem-transparente'),
            share: document.getElementById('divisao-lucro')
        };

        Object.entries(inputs).forEach(([key, input]) => {
            if (!input) return;

            const value = parseFloat(input.value);
            let isValid = true;
            let message = '';

            switch (key) {
                case 'volume':
                    isValid = value > 0 && value <= 100;
                    message = 'Volume deve estar entre 0.1 e 100 m³';
                    break;
                case 'basePrice':
                    isValid = value >= 500 && value <= 3000;
                    message = 'Preço deve estar entre R$ 500 e R$ 3.000/m³';
                    break;
                case 'distance':
                    isValid = value >= 50 && value <= 3000;
                    message = 'Distância deve estar entre 50 e 3.000 km';
                    break;
                case 'freight':
                    isValid = value >= 1000 && value <= 50000;
                    message = 'Frete deve estar entre R$ 1.000 e R$ 50.000';
                    break;
                case 'margin':
                    isValid = value >= 5 && value <= 30;
                    message = 'Margem deve estar entre 5% e 30%';
                    break;
                case 'share':
                    isValid = value >= 50 && value <= 80;
                    message = 'Divisão deve estar entre 50% e 80%';
                    break;
            }

            this.setInputValidation(input, isValid, message);
        });
    }

    setInputValidation(input, isValid, message) {
        const container = input.closest('.input-group');
        let errorElement = container.querySelector('.error-message');

        if (!isValid) {
            input.style.borderColor = '#e74c3c';
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
                container.appendChild(errorElement);
            }
            errorElement.textContent = message;
        } else {
            input.style.borderColor = '#27ae60';
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    updateRealTimeCalculation() {
        // Debounce the calculation
        clearTimeout(this.calculationTimeout);
        this.calculationTimeout = setTimeout(() => {
            this.performCalculation(false);
        }, 500);
    }

    performCalculation(showFullResults = true) {
        const inputs = this.getInputValues();
        if (!this.validateAllInputs(inputs)) return;

        const results = this.calculateTransparencyMetrics(inputs);
        
        if (showFullResults) {
            this.displayFullResults(results, inputs);
            this.saveScenario(inputs, results);
        } else {
            this.displayQuickResults(results);
        }
    }

    getInputValues() {
        return {
            volume: parseFloat(document.getElementById('volume-fornecedor')?.value || this.defaultValues.volume),
            basePrice: parseFloat(document.getElementById('preco-base')?.value || this.defaultValues.basePrice),
            distance: parseFloat(document.getElementById('distancia')?.value || this.defaultValues.distance),
            freight: parseFloat(document.getElementById('custo-frete')?.value || this.defaultValues.freight),
            margin: parseFloat(document.getElementById('margem-transparente')?.value || this.defaultValues.transparentMargin),
            share: parseFloat(document.getElementById('divisao-lucro')?.value || this.defaultValues.supplierShare)
        };
    }

    validateAllInputs(inputs) {
        return Object.values(inputs).every(value => !isNaN(value) && value > 0);
    }

    calculateTransparencyMetrics(inputs) {
        const { volume, basePrice, distance, freight, margin, share } = inputs;

        // Basic calculations
        const supplierBase = volume * basePrice;
        const totalOperationCost = supplierBase + freight;
        const appliedMargin = totalOperationCost * (margin / 100);
        const finalClientPrice = totalOperationCost + appliedMargin;
        const excessProfit = appliedMargin;
        const supplierProfit = excessProfit * (share / 100);
        const systemProfit = excessProfit * ((100 - share) / 100);
        const finalPricePerM3 = finalClientPrice / volume;
        const freightPerKm = freight / distance;
        
        // Advanced metrics
        const totalSupplierRevenue = supplierBase + supplierProfit;
        const supplierProfitMargin = (supplierProfit / supplierBase) * 100;
        const systemProfitMargin = (systemProfit / totalOperationCost) * 100;
        const operationalEfficiency = (freight / finalClientPrice) * 100;
        const priceCompetitiveness = this.calculateCompetitiveness(finalPricePerM3);
        
        // ROI calculations
        const supplierROI = (supplierProfit / supplierBase) * 100;
        const systemROI = (systemProfit / (freight + (totalOperationCost * 0.1))) * 100; // Assuming 10% operational cost
        
        return {
            // Basic results
            supplierBase,
            totalOperationCost,
            appliedMargin,
            finalClientPrice,
            excessProfit,
            supplierProfit,
            systemProfit,
            finalPricePerM3,
            freightPerKm,
            totalSupplierRevenue,
            
            // Advanced metrics
            supplierProfitMargin,
            systemProfitMargin,
            operationalEfficiency,
            priceCompetitiveness,
            supplierROI,
            systemROI,
            
            // Efficiency indicators
            costEfficiency: this.calculateCostEfficiency(freightPerKm, operationalEfficiency),
            marketPosition: this.getMarketPosition(finalPricePerM3),
            recommendedActions: this.getRecommendations(inputs, {
                supplierProfitMargin,
                operationalEfficiency,
                priceCompetitiveness
            })
        };
    }

    calculateCompetitiveness(pricePerM3) {
        const marketAverage = 1350; // Average market price per m³
        const competitiveness = ((marketAverage - pricePerM3) / marketAverage) * 100;
        return Math.max(-50, Math.min(50, competitiveness)); // Cap between -50% and +50%
    }

    calculateCostEfficiency(freightPerKm, operationalEfficiency) {
        const nationalAverage = 10.5; // R$/km
        const freightEfficiency = ((nationalAverage - freightPerKm) / nationalAverage) * 100;
        return (freightEfficiency + (100 - operationalEfficiency)) / 2;
    }

    getMarketPosition(pricePerM3) {
        if (pricePerM3 < 1200) return { level: 'Altamente Competitivo', color: '#27ae60' };
        if (pricePerM3 < 1350) return { level: 'Competitivo', color: '#3498db' };
        if (pricePerM3 < 1500) return { level: 'Médio', color: '#f39c12' };
        return { level: 'Alto', color: '#e74c3c' };
    }

    getRecommendations(inputs, metrics) {
        const recommendations = [];
        
        if (metrics.supplierProfitMargin < 10) {
            recommendations.push('💡 Considere aumentar a divisão de lucro para o fornecedor');
        }
        
        if (metrics.operationalEfficiency > 25) {
            recommendations.push('🚛 Otimize a logística para reduzir custos de frete');
        }
        
        if (metrics.priceCompetitiveness < -20) {
            recommendations.push('💰 Preço muito alto - ajuste a margem transparente');
        }
        
        if (inputs.distance > 1500) {
            recommendations.push('📍 Avalie fornecedores mais próximos para esta rota');
        }
        
        if (inputs.volume < 30) {
            recommendations.push('📦 Considere consolidar cargas para otimizar frete');
        }
        
        return recommendations;
    }

    displayFullResults(results, inputs) {
        const resultsContainer = document.getElementById('transparency-results');
        if (!resultsContainer) return;

        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <h4>📊 Análise Completa de Transparência</h4>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">
                    <h5>💰 Financeiro</h5>
                    <div class="result-item">
                        <span class="result-label">Valor Base Fornecedor:</span>
                        <span class="result-value">${this.formatCurrency(results.supplierBase)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Custo Total Operação:</span>
                        <span class="result-value">${this.formatCurrency(results.totalOperationCost)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Preço Final Cliente:</span>
                        <span class="result-value">${this.formatCurrency(results.finalClientPrice)}</span>
                    </div>
                </div>
                
                <div style="background: #e8f5e8; padding: 1rem; border-radius: 5px;">
                    <h5>📈 Lucratividade</h5>
                    <div class="result-item">
                        <span class="result-label">Lucro Fornecedor:</span>
                        <span class="result-value">${this.formatCurrency(results.supplierProfit)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Margem Fornecedor:</span>
                        <span class="result-value">${results.supplierProfitMargin.toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">ROI Fornecedor:</span>
                        <span class="result-value">${results.supplierROI.toFixed(1)}%</span>
                    </div>
                </div>
                
                <div style="background: #e8f4fd; padding: 1rem; border-radius: 5px;">
                    <h5>🎯 Eficiência</h5>
                    <div class="result-item">
                        <span class="result-label">Eficiência Operacional:</span>
                        <span class="result-value">${results.operationalEfficiency.toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Competitividade:</span>
                        <span class="result-value">${results.priceCompetitiveness.toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Posição Mercado:</span>
                        <span class="result-value" style="color: ${results.marketPosition.color}">${results.marketPosition.level}</span>
                    </div>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                <h5>💡 Recomendações Estratégicas</h5>
                ${results.recommendedActions.length > 0 
                    ? results.recommendedActions.map(rec => `<p style="margin: 0.5rem 0;">• ${rec}</p>`).join('')
                    : '<p>✅ Operação otimizada - Continue com os parâmetros atuais.</p>'
                }
            </div>
            
            <div style="background: #d4edda; padding: 1rem; border-radius: 5px;">
                <h5>🎯 Resumo Executivo</h5>
                <p><strong>Receita Total Fornecedor:</strong> ${this.formatCurrency(results.totalSupplierRevenue)}</p>
                <p><strong>Preço por m³ ao Cliente:</strong> R$ ${results.finalPricePerM3.toFixed(2)}/m³</p>
                <p><strong>Custo Logístico por km:</strong> R$ ${results.freightPerKm.toFixed(2)}/km</p>
            </div>
            
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="transparencyCalculator.saveScenarioAs()">💾 Salvar Cenário</button>
                <button class="btn btn-primary" onclick="transparencyCalculator.generateReport()">📄 Gerar Relatório</button>
                <button class="btn btn-success" onclick="transparencyCalculator.exportToExcel()">📊 Exportar Excel</button>
            </div>
        `;
    }

    displayQuickResults(results) {
        // Update key metrics in real-time without full display
        const quickElements = {
            'quick-supplier-revenue': this.formatCurrency(results.totalSupplierRevenue),
            'quick-final-price': `R$ ${results.finalPricePerM3.toFixed(2)}/m³`,
            'quick-efficiency': `${results.operationalEfficiency.toFixed(1)}%`
        };

        Object.entries(quickElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    saveScenario(inputs, results) {
        const scenario = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            inputs,
            results,
            name: `Cenário ${this.scenarios.length + 1}`
        };

        this.scenarios.push(scenario);
        this.saveToLocalStorage();
    }

    saveScenarioAs() {
        const name = prompt('Nome para o cenário:', `Análise ${new Date().toLocaleDateString('pt-BR')}`);
        if (name) {
            const inputs = this.getInputValues();
            const results = this.calculateTransparencyMetrics(inputs);
            
            const scenario = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                inputs,
                results,
                name
            };

            this.scenarios.push(scenario);
            this.saveToLocalStorage();
            
            alert(`Cenário "${name}" salvo com sucesso!`);
        }
    }

    loadSavedScenarios() {
        const saved = localStorage.getItem('transparency_scenarios');
        if (saved) {
            this.scenarios = JSON.parse(saved);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('transparency_scenarios', JSON.stringify(this.scenarios));
    }

    generateReport() {
        const inputs = this.getInputValues();
        const results = this.calculateTransparencyMetrics(inputs);
        
        const report = this.createHTMLReport(inputs, results);
        const newWindow = window.open('', '_blank');
        newWindow.document.write(report);
        newWindow.document.close();
    }

    createHTMLReport(inputs, results) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Transparência - Sistema Madeiras Logística</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 1rem; }
                    .section { margin: 2rem 0; }
                    .metric { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #eee; }
                    .highlight { background: #f8f9fa; padding: 1rem; border-left: 4px solid #27ae60; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌲 Sistema Madeiras Logística</h1>
                    <h2>Relatório de Análise de Transparência</h2>
                    <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                </div>
                
                <div class="section">
                    <h3>📊 Dados da Operação</h3>
                    <div class="metric"><span>Volume:</span><span>${inputs.volume} m³</span></div>
                    <div class="metric"><span>Distância:</span><span>${inputs.distance} km</span></div>
                    <div class="metric"><span>Preço Base:</span><span>${this.formatCurrency(inputs.basePrice)}/m³</span></div>
                    <div class="metric"><span>Frete:</span><span>${this.formatCurrency(inputs.freight)}</span></div>
                </div>
                
                <div class="section">
                    <h3>💰 Resultados Financeiros</h3>
                    <div class="metric"><span>Receita Total Fornecedor:</span><span>${this.formatCurrency(results.totalSupplierRevenue)}</span></div>
                    <div class="metric"><span>Lucro Fornecedor:</span><span>${this.formatCurrency(results.supplierProfit)}</span></div>
                    <div class="metric"><span>Preço Final Cliente:</span><span>${this.formatCurrency(results.finalClientPrice)}</span></div>
                </div>
                
                <div class="highlight">
                    <h3>🎯 Resumo Executivo</h3>
                    <p>A operação apresenta margem de lucro de ${results.supplierProfitMargin.toFixed(1)}% para o fornecedor, 
                    com eficiência operacional de ${results.operationalEfficiency.toFixed(1)}% e posicionamento de mercado 
                    ${results.marketPosition.level.toLowerCase()}.</p>
                </div>
            </body>
            </html>
        `;
    }

    exportToExcel() {
        const inputs = this.getInputValues();
        const results = this.calculateTransparencyMetrics(inputs);
        
        // Create CSV data
        const csvData = this.createCSVData(inputs, results);
        
        // Download CSV file
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `analise_transparencia_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    createCSVData(inputs, results) {
        const headers = [
            'Métrica',
            'Valor',
            'Unidade',
            'Observações'
        ];

        const rows = [
            ['Volume', inputs.volume, 'm³', 'Volume total da operação'],
            ['Distância', inputs.distance, 'km', 'Distância total da rota'],
            ['Preço Base', inputs.basePrice, 'R$/m³', 'Preço base do fornecedor'],
            ['Frete', inputs.freight, 'R$', 'Custo total do frete'],
            ['Margem Transparente', inputs.margin, '%', 'Margem aplicada pelo sistema'],
            ['Divisão Lucro Fornecedor', inputs.share, '%', 'Percentual do lucro excedente'],
            ['', '', '', ''],
            ['Receita Total Fornecedor', results.totalSupplierRevenue, 'R$', 'Base + lucro excedente'],
            ['Lucro Fornecedor', results.supplierProfit, 'R$', 'Parte do lucro excedente'],
            ['Preço Final Cliente', results.finalClientPrice, 'R$', 'Preço total da operação'],
            ['Preço por m³', results.finalPricePerM3.toFixed(2), 'R$/m³', 'Preço unitário ao cliente'],
            ['ROI Fornecedor', results.supplierROI.toFixed(1), '%', 'Retorno sobre investimento'],
            ['Eficiência Operacional', results.operationalEfficiency.toFixed(1), '%', 'Percentual do frete no total'],
            ['Posição Mercado', results.marketPosition.level, '', 'Competitividade no mercado']
        ];

        // Convert to CSV format
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        return '\ufeff' + csvContent; // Add BOM for Excel compatibility
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    window.transparencyCalculator = new TransparencyCalculator();
    transparencyCalculator.init();
});