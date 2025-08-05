#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script PowerShell - Otimização Estratégica Sistema Madeiras Logística
    
.DESCRIPTION
    Script único e robusto que executa todas as otimizações, correções e melhorias estratégicas
    necessárias para potencializar o sistema de transparência total.
    
.PARAMETER SkipBackup
    Pula a criação de backup automático antes das modificações
    
.PARAMETER TestMode
    Executa em modo de teste sem fazer alterações permanentes
    
.EXAMPLE
    .\otimizacao-completa.ps1
    
.EXAMPLE
    .\otimizacao-completa.ps1 -TestMode
#>

[CmdletBinding()]
param(
    [switch]$SkipBackup,
    [switch]$TestMode
)

# Configuração inicial
$ErrorActionPreference = "Stop"
$VerbosePreference = "Continue"

# Variáveis globais
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Split-Path -Parent $ScriptRoot
$LogFile = Join-Path $ProjectRoot "logs" "otimizacao-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$BackupDir = Join-Path $ProjectRoot "backup" "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Ensure logs directory exists
New-Item -ItemType Directory -Force -Path (Split-Path $LogFile -Parent) | Out-Null

#region Logging Functions
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $LogFile -Value $logMessage
}

function Write-Section {
    param([string]$Title)
    $separator = "=" * 80
    Write-Log $separator
    Write-Log "  $Title"
    Write-Log $separator
}
#endregion

#region Backup Functions
function New-SystemBackup {
    if ($SkipBackup) {
        Write-Log "Backup pulado conforme solicitado" -Level "WARN"
        return
    }
    
    Write-Section "CRIANDO BACKUP DO SISTEMA"
    
    try {
        New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
        
        # Backup de arquivos essenciais
        $filesToBackup = @(
            "assets",
            "modules", 
            "reports",
            "*.html",
            "*.css", 
            "*.js",
            "*.json"
        )
        
        foreach ($pattern in $filesToBackup) {
            $files = Get-ChildItem -Path $ProjectRoot -Filter $pattern -Recurse -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                $relativePath = $file.FullName.Substring($ProjectRoot.Length + 1)
                $backupPath = Join-Path $BackupDir $relativePath
                $backupDir = Split-Path $backupPath -Parent
                
                if (-not (Test-Path $backupDir)) {
                    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
                }
                
                Copy-Item -Path $file.FullName -Destination $backupPath -Force
            }
        }
        
        Write-Log "Backup criado em: $BackupDir" -Level "SUCCESS"
    }
    catch {
        Write-Log "Erro ao criar backup: $($_.Exception.Message)" -Level "ERROR"
        throw
    }
}
#endregion

#region System Validation
function Test-SystemIntegrity {
    Write-Section "VALIDAÇÃO DE INTEGRIDADE DO SISTEMA"
    
    $issues = @()
    
    # Verificar estrutura de diretórios
    $requiredDirs = @("assets", "assets/css", "assets/js", "assets/images", "modules", "reports", "reports/templates")
    foreach ($dir in $requiredDirs) {
        $dirPath = Join-Path $ProjectRoot $dir
        if (-not (Test-Path $dirPath)) {
            Write-Log "Criando diretório: $dir"
            New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
        }
    }
    
    # Verificar arquivos HTML
    $htmlFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.html" -Recurse
    foreach ($file in $htmlFiles) {
        try {
            $content = Get-Content -Path $file.FullName -Raw
            if ($content -notmatch "<!DOCTYPE|<html") {
                $issues += "HTML inválido: $($file.Name)"
            }
        }
        catch {
            $issues += "Erro ao ler HTML: $($file.Name)"
        }
    }
    
    # Verificar arquivos CSS
    $cssFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.css" -Recurse
    foreach ($file in $cssFiles) {
        try {
            $content = Get-Content -Path $file.FullName -Raw
            # Verificação básica de sintaxe CSS
            $openBraces = ($content -split '\{').Count - 1
            $closeBraces = ($content -split '\}').Count - 1
            if ($openBraces -ne $closeBraces) {
                $issues += "CSS com chaves desbalanceadas: $($file.Name)"
            }
        }
        catch {
            $issues += "Erro ao ler CSS: $($file.Name)"
        }
    }
    
    # Verificar arquivos JavaScript
    $jsFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.js" -Recurse
    foreach ($file in $jsFiles) {
        try {
            $content = Get-Content -Path $file.FullName -Raw
            # Verificação básica de sintaxe JavaScript
            if ($content -match "function\s+\w+\s*\([^)]*\)\s*\{" -and $content -notmatch "\}") {
                $issues += "JavaScript com função incompleta: $($file.Name)"
            }
        }
        catch {
            $issues += "Erro ao ler JavaScript: $($file.Name)"
        }
    }
    
    if ($issues.Count -eq 0) {
        Write-Log "Integridade do sistema validada com sucesso" -Level "SUCCESS"
    } else {
        Write-Log "Problemas encontrados:" -Level "WARN"
        foreach ($issue in $issues) {
            Write-Log "  - $issue" -Level "WARN"
        }
    }
    
    return $issues
}
#endregion

#region Performance Optimization
function Optimize-WebAssets {
    Write-Section "OTIMIZAÇÃO DE ASSETS WEB"
    
    # Minificar CSS
    $cssFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.css" -Recurse
    foreach ($file in $cssFiles) {
        if ($file.Name -notlike "*.min.css") {
            Write-Log "Minificando CSS: $($file.Name)"
            $content = Get-Content -Path $file.FullName -Raw
            
            # Minificação básica de CSS
            $minified = $content -replace '/\*.*?\*/', '' `
                                -replace '\s+', ' ' `
                                -replace ';\s*}', '}' `
                                -replace '{\s*', '{' `
                                -replace '}\s*', '}' `
                                -replace ':\s*', ':' `
                                -replace ';\s*', ';'
            
            $minFile = $file.FullName -replace '\.css$', '.min.css'
            if (-not $TestMode) {
                Set-Content -Path $minFile -Value $minified.Trim()
            }
            Write-Log "CSS minificado salvo: $(Split-Path $minFile -Leaf)"
        }
    }
    
    # Minificar JavaScript
    $jsFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.js" -Recurse | Where-Object { $_.Name -notlike "*.min.js" }
    foreach ($file in $jsFiles) {
        Write-Log "Minificando JavaScript: $($file.Name)"
        $content = Get-Content -Path $file.FullName -Raw
        
        # Minificação básica de JavaScript
        $minified = $content -replace '//.*$', '' `
                            -replace '/\*.*?\*/', '' `
                            -replace '\s+', ' ' `
                            -replace ';\s*', ';' `
                            -replace '{\s*', '{' `
                            -replace '}\s*', '}' `
                            -replace ',\s*', ','
        
        $minFile = $file.FullName -replace '\.js$', '.min.js'
        if (-not $TestMode) {
            Set-Content -Path $minFile -Value $minified.Trim()
        }
        Write-Log "JavaScript minificado salvo: $(Split-Path $minFile -Leaf)"
    }
}
#endregion

#region System Creation
function New-TransparencySystem {
    Write-Section "CRIANDO SISTEMA DE TRANSPARÊNCIA"
    
    # Criar página principal do dashboard
    $dashboardHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Madeiras Logística - Dashboard de Transparência</title>
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2E7D32">
</head>
<body>
    <header class="dashboard-header">
        <div class="container">
            <h1>📊 Sistema Madeiras Logística</h1>
            <nav>
                <a href="#dashboard" class="nav-link active">Dashboard</a>
                <a href="#calculator" class="nav-link">Calculadora</a>
                <a href="#reports" class="nav-link">Relatórios</a>
                <a href="#settings" class="nav-link">Configurações</a>
            </nav>
        </div>
    </header>

    <main class="dashboard-main">
        <div class="container">
            <!-- KPIs em Tempo Real -->
            <section id="kpis" class="kpi-grid">
                <div class="kpi-card">
                    <h3>💰 Receita Total</h3>
                    <div class="kpi-value" id="total-revenue">R$ 0,00</div>
                    <div class="kpi-change positive">+12.5%</div>
                </div>
                <div class="kpi-card">
                    <h3>🚛 Operações Ativas</h3>
                    <div class="kpi-value" id="active-operations">0</div>
                    <div class="kpi-change positive">+3</div>
                </div>
                <div class="kpi-card">
                    <h3>📈 ROI Médio</h3>
                    <div class="kpi-value" id="average-roi">0%</div>
                    <div class="kpi-change negative">-2.1%</div>
                </div>
                <div class="kpi-card">
                    <h3>⛽ Custo Combustível</h3>
                    <div class="kpi-value" id="fuel-cost">R$ 0,00</div>
                    <div class="kpi-change positive">-5.3%</div>
                </div>
            </section>

            <!-- Calculadora de Transparência -->
            <section id="calculator" class="calculator-section">
                <h2>🧮 Calculadora de Transparência (Modelo 70/30)</h2>
                <div class="calculator-grid">
                    <div class="input-group">
                        <label for="route-distance">Distância da Rota (km)</label>
                        <input type="number" id="route-distance" placeholder="Ex: 500" min="1">
                        <span class="tooltip">Distância total ida e volta</span>
                    </div>
                    <div class="input-group">
                        <label for="fuel-price">Preço Combustível (R$/L)</label>
                        <input type="number" id="fuel-price" placeholder="Ex: 5.50" step="0.01" min="0">
                        <span class="tooltip">Preço atual do diesel</span>
                    </div>
                    <div class="input-group">
                        <label for="cargo-weight">Peso da Carga (ton)</label>
                        <input type="number" id="cargo-weight" placeholder="Ex: 25" step="0.1" min="0">
                        <span class="tooltip">Peso total da madeira</span>
                    </div>
                    <div class="input-group">
                        <label for="wood-price">Preço da Madeira (R$/m³)</label>
                        <input type="number" id="wood-price" placeholder="Ex: 150.00" step="0.01" min="0">
                        <span class="tooltip">Preço por metro cúbico</span>
                    </div>
                </div>
                
                <button id="calculate-btn" class="calculate-button">🔢 Calcular Transparência</button>
                
                <div id="results" class="results-section" style="display: none;">
                    <h3>📊 Resultados do Cálculo</h3>
                    <div class="results-grid">
                        <div class="result-item">
                            <label>Custo Total Operação:</label>
                            <span id="total-cost">R$ 0,00</span>
                        </div>
                        <div class="result-item">
                            <label>Receita Bruta:</label>
                            <span id="gross-revenue">R$ 0,00</span>
                        </div>
                        <div class="result-item">
                            <label>Margem Operacional (70%):</label>
                            <span id="operational-margin">R$ 0,00</span>
                        </div>
                        <div class="result-item">
                            <label>Reserva Estratégica (30%):</label>
                            <span id="strategic-reserve">R$ 0,00</span>
                        </div>
                        <div class="result-item highlight">
                            <label>ROI Projetado:</label>
                            <span id="projected-roi">0%</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Gráficos e Análises -->
            <section id="charts" class="charts-section">
                <h2>📈 Análises e Tendências</h2>
                <div class="charts-grid">
                    <div class="chart-container">
                        <canvas id="revenue-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="costs-chart"></canvas>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script src="assets/js/dashboard.js"></script>
    <script src="assets/js/calculator.js"></script>
    <script src="assets/js/charts.js"></script>
    <script src="modules/pwa-service-worker.js"></script>
</body>
</html>
"@

    if (-not $TestMode) {
        Set-Content -Path (Join-Path $ProjectRoot "dashboard.html") -Value $dashboardHtml -Encoding UTF8
    }
    Write-Log "Dashboard HTML criado com sucesso"
}
#endregion

#region Main Execution
function Start-OptimizationProcess {
    Write-Section "INICIANDO PROCESSO DE OTIMIZAÇÃO"
    Write-Log "Modo de teste: $TestMode"
    Write-Log "Pular backup: $SkipBackup"
    
    try {
        # 1. Criar backup
        New-SystemBackup
        
        # 2. Validar integridade
        $issues = Test-SystemIntegrity
        
        # 3. Criar sistema de transparência
        New-TransparencySystem
        
        # 4. Otimizar assets
        Optimize-WebAssets
        
        Write-Section "PROCESSO CONCLUÍDO COM SUCESSO"
        Write-Log "Logs salvos em: $LogFile"
        if (-not $SkipBackup) {
            Write-Log "Backup disponível em: $BackupDir"
        }
        
        return @{
            Success = $true
            Issues = $issues
            LogFile = $LogFile
            BackupDir = $BackupDir
        }
    }
    catch {
        Write-Log "Erro crítico no processo: $($_.Exception.Message)" -Level "ERROR"
        Write-Log "Stack trace: $($_.ScriptStackTrace)" -Level "ERROR"
        
        return @{
            Success = $false
            Error = $_.Exception.Message
            LogFile = $LogFile
        }
    }
}

# Executar processo principal
$result = Start-OptimizationProcess

# Exibir resultado final
if ($result.Success) {
    Write-Host "`n✅ Otimização concluída com sucesso!" -ForegroundColor Green
    if ($result.Issues.Count -gt 0) {
        Write-Host "⚠️  $($result.Issues.Count) problemas identificados e documentados." -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Erro durante a otimização: $($result.Error)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Logs: $($result.LogFile)" -ForegroundColor Cyan
if ($result.BackupDir) {
    Write-Host "💾 Backup: $($result.BackupDir)" -ForegroundColor Cyan
}
#endregion