import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "dashboard": "Dashboard",
        "scan": "Manual Scan",
        "connect": "Connect GitHub",
        "integrations": "Integrations",
        "upgrade": "Upgrade",
        "login": "Login"
      },
      "auth": {
        "or": "OR",
        "backHome": "Back to Home",
        "google": "Continue with Google",
        "github": "Continue with GitHub"
      },
      "landing": {
        "badge": "The Future of Code Security is Here",
        "title1": "Never Merge a ",
        "titleHighlight": "Vulnerability",
        "title2": " Again.",
        "desc": "Aegis AI acts as your senior security engineer, automatically reviewing every Pull Request for critical bugs, secrets, and vulnerabilities before they reach production.",
        "btnStart": "Get Started for Free",
        "btnDemo": "View Demo",
        "mockup": {
          "commit": "feat: update user authentication flow",
          "alert": "Critical Vulnerability Detected: SQL Injection",
          "desc": "The parameter userInput on line 42 is being directly concatenated into the database query without sanitization.",
          "btnFix": "Apply Fix"
        },
        "features": {
          "f1": { "title": "Zero-Day Detection", "desc": "Our AI engine is trained on millions of open-source vulnerabilities to detect patterns before they are published." },
          "f2": { "title": "Context-Aware Analysis", "desc": "Aegis doesn't just grep for bad patterns. It understands data flow across your entire codebase." },
          "f3": { "title": "One-Click Remediation", "desc": "Get actionable fixes in your PRs. Just click 'Commit suggestion' to resolve issues instantly." }
        }
      },
      "dashboard": {
        "title": "Security Dashboard",
        "subtitle": "Welcome back, security looks good today.",
        "btnSync": "Sync Repositories",
        "scoreTitle": "Overall Security Score",
        "scoreDelta": "+5 this week",
        "reposTitle": "Active Monitored Repos",
        "vulnTitle": "Vulnerabilities Prevented",
        "tableTitle": "Monitored Repositories",
        "trendTitle": "Vulnerabilities Trend (30 Days)",
        "distTitle": "Severity Distribution",
        "vulnLabel": "Vulnerabilities",
        "thRepo": "Repository",
        "thStatus": "Status",
        "thIssues": "Open Issues",
        "thScan": "Last Scan",
        "thAction": "Action",
        "btnLogs": "View Logs",
        "status": {
          "clean": "Clean",
          "warning": "Warning",
          "critical": "Critical"
        },
        "times": {
          "2m": "2 mins ago",
          "1h": "1 hr ago",
          "5h": "5 hrs ago"
        }
      },
      "scan": {
        "title": "Code Scanner",
        "subtitle": "Scan your repository or local code directory instantly. Aegis AI detects SQL injections, XSS, and hardcoded secrets within seconds.",
        "dropTitle": "Drag & Drop your code here",
        "dropDesc": "or click to select your files manually",
        "or": "OR",
        "btnFile": "Select Archive (.zip)",
        "btnFolder": "Directory",
        "quota": "Scan Quota:",
        "left": "Left (Starter Plan) —",
        "unlimited": "for unlimited access.",
        "scanRepo": "Scan Repo",
        "autoScan": "Schedule Auto-Scan (Pro)",
        "history": "Recent Scans",
        "noHistory": "No scan history yet.",
        "vulnFound": "vulnerabilities found",
        "viewReport": "View Report",
        "quotaExceeded": "Scan Quota Exceeded",
        "premiumAutoScan": "Premium Feature: Auto-Scan",
        "quotaMsg": "You have used all 10 free scans in your Starter plan. Upgrade to Pro now to get unlimited scanning, real-time protection, and compliance reports.",
        "autoScanMsg": "Schedule stealthy automated daily scans. Upgrade to Pro now to unlock full automation, unlimited scans, and real-time protection.",
        "simulate": "Simulate Payment & Upgrade ($49)",
        "cancel": "Cancel",
        "loading": "Analyzing Codebase..."
      },
      "report": {
        "title": "Code Analysis Report",
        "back": "Back",
        "downloadPdf": "Download PDF",
        "score": "Security Score",
        "status": "System Status",
        "totalVulns": "Total Vulnerabilities",
        "conclusion": "Aegis Core Conclusion",
        "vulnDetails": "Vulnerability Details",
        "noVulns": "No vulnerabilities found. The code is secure.",
        "line": "Line",
        "desc": "Description",
        "recommendation": "Recommendation",
        "fixedCode": "Suggested Fix",
        "copyJira": "Copy to Jira"
      },
      "integration": {
        "title": "CI/CD Pipeline Integration",
        "subtitle": "Make security an automated part of your software development life cycle (SDLC). Prevent vulnerabilities before they reach production.",
        "ghActions": "GitHub Actions",
        "ghActionsDesc": "Copy the workflow configuration below and save it as a .github/workflows/aegis.yml file in your repository. Aegis AI will automatically scan every Push and Pull Request.",
        "copy": "Copy Script",
        "copied": "Copied!",
        "comingSoon": "GitLab CI & Jenkins (Coming Soon)",
        "comingSoonDesc": "Official support for GitLab CI/CD, Jenkins, and Bitbucket Pipelines is under development and will be released in the next enterprise version."
      },
      "login": { "title": "Welcome Back", "subtitle": "Sign in to Aegis AI", "email": "Email Address", "password": "Password", "btn": "Sign In", "noAccount": "Don't have an account?", "register": "Register here", "remember": "Remember me", "forgot": "Forgot Password?" },
      "register": { "title": "Create Account", "subtitle": "Join Aegis AI today", "username": "Username", "email": "Email", "password": "Password", "btn": "Sign Up", "hasAccount": "Already have an account?", "login": "Log in" },
      "pricing": { 
        "title": "Simple, Transparent Pricing", 
        "subtitle": "Choose the plan that's right for your team's security needs.", 
        "btnPro": "Upgrade to Pro", 
        "btnStarter": "Get Started", 
        "month": "/mo",
        "cards": {
          "starterDesc": "Essential protection for independent developers and hobbyists.",
          "mostPopular": "Most Popular",
          "proDesc": "Military-grade protection. Unlock all Aegis Core features for professionals.",
          "teamDesc": "Massive infrastructure for enterprise DevSecOps teams and agencies.",
          "contactSales": "Contact Sales"
        },
        "features": {
          "manualScan": "Manual Scanning",
          "maxFiles": "Max 10 Files / Month",
          "basicReport": "Basic Vulnerability Report",
          "autoPatch": "Aegis Auto-Patch Feature",
          "queuePriority": "Queue Analysis Priority",
          "unlimitedScan": "Unlimited Scanning",
          "fullAutoPatch": "✨ Full Aegis Auto-Patch Access",
          "zeroDay": "Zero-Day Vulnerability Detection",
          "ide": "IDE Integration (VSCode, JetBrains)",
          "priorityLine": "Priority Analysis Line",
          "allPro": "All Pro Features",
          "teamDashboard": "Centralized Team Dashboard",
          "api": "Aegis API Engine Access",
          "cicd": "CI/CD Pipeline Integration",
          "support": "24/7 Priority Support"
        },
        "compare": "Compare Features",
        "thFeatures": "Features",
        "faqTitle": "Billing FAQ",
        "compareRows": {
          "row1": "Scans per Month",
          "unlimited": "Unlimited",
          "row2": "Auto-Patch Fixes",
          "row3": "Zero-Day Detection",
          "row4": "IDE Extensions",
          "row5": "Team Analytics Dashboard",
          "row6": "Custom CI/CD Webhooks",
          "row7": "API Access",
          "row8": "Support Level",
          "community": "Community",
          "priority": "Priority Email",
          "dedicated": "24/7 Dedicated"
        },
        "faqs": {
          "q1": "Are there any binding contracts?",
          "a1": "No. You can cancel or change your subscription plan at any time without hidden fees.",
          "q2": "How is the Team plan calculated?",
          "a2": "The Team plan is calculated per user (seat). You can add or remove team members at any time from the admin dashboard.",
          "q3": "Does Aegis AI store my source code?",
          "a3": "No. Your source code is scanned directly in memory and immediately deleted as soon as the report is generated.",
          "q4": "What is Zero-Day detection?",
          "a4": "Pro and Team features use AI models that are constantly updated to detect new vulnerabilities not yet documented in public CVE databases."
        }
      },
      "checkout": { "title": "Checkout", "subtitle": "Complete your upgrade to PRO", "card": "Card Details", "pay": "Pay Now", "success": "Payment Successful!" },
      "about": { "title": "About Us", "subtitle": "Securing the world's code", "content": "We are a team of security researchers building the future of DevSecOps." },
      "blog": { "title": "Aegis Blog", "subtitle": "Latest news and security research", "readMore": "Read More" },
      "contact": { "title": "Contact Us", "subtitle": "We'd love to hear from you", "name": "Your Name", "email": "Company Email", "message": "Your Message", "send": "Send Message", "successTitle": "Message Sent!", "successDesc": "Our specialist team will get back to you within 24 hours." }
    }
  },
  es: {
    translation: {
      "nav": {
        "home": "Inicio",
        "dashboard": "Panel",
        "scan": "Escaneo Manual",
        "connect": "Conectar GitHub",
        "integrations": "Integraciones",
        "upgrade": "Mejorar",
        "login": "Iniciar sesión"
      },
      "auth": {
        "or": "O",
        "backHome": "Volver al inicio",
        "google": "Continuar con Google",
        "github": "Continuar con GitHub"
      },
      "landing": {
        "badge": "El futuro de la seguridad del código está aquí",
        "title1": "Nunca fusiones una ",
        "titleHighlight": "Vulnerabilidad",
        "title2": " de nuevo.",
        "desc": "Aegis AI actúa como su ingeniero de seguridad sénior, revisando automáticamente cada Pull Request en busca de errores críticos, secretos y vulnerabilidades antes de que lleguen a producción.",
        "btnStart": "Comience Gratis",
        "btnDemo": "Ver Demostración",
        "mockup": {
          "commit": "feat: actualizar flujo de autenticación",
          "alert": "Vulnerabilidad crítica detectada: Inyección SQL",
          "desc": "El parámetro userInput en la línea 42 se concatena directamente en la consulta a la base de datos sin desinfección.",
          "btnFix": "Aplicar Solución"
        },
        "features": {
          "f1": { "title": "Detección de Zero-Day", "desc": "Nuestro motor de IA está entrenado en millones de vulnerabilidades de código abierto para detectar patrones antes de que se publiquen." },
          "f2": { "title": "Análisis Contextual", "desc": "Aegis no solo busca patrones erróneos. Comprende el flujo de datos en todo su código." },
          "f3": { "title": "Remediación en un Clic", "desc": "Obtenga soluciones procesables en sus PRs. Simplemente haga clic en 'Confirmar sugerencia'." }
        }
      },
      "dashboard": {
        "title": "Panel de Seguridad",
        "subtitle": "Bienvenido de nuevo, la seguridad se ve bien hoy.",
        "btnSync": "Sincronizar Repositorios",
        "scoreTitle": "Puntuación de Seguridad",
        "scoreDelta": "+5 esta semana",
        "reposTitle": "Repositorios Monitoreados",
        "vulnTitle": "Vulnerabilidades Prevenidas",
        "tableTitle": "Repositorios Monitoreados",
        "trendTitle": "Tendencia de Vulnerabilidades (30 Días)",
        "distTitle": "Distribución de Gravedad",
        "vulnLabel": "Vulnerabilidades",
        "thRepo": "Repositorio",
        "thStatus": "Estado",
        "thIssues": "Problemas",
        "thScan": "Último Escaneo",
        "thAction": "Acción",
        "locked": "Panel Bloqueado",
        "lockedDesc": "Las analíticas avanzadas, métricas de tendencias y gestión multi-repositorio son exclusivas para usuarios Pro.",
        "upgradePro": "Actualizar a Pro",
        "noData": "No se encontraron datos.",
        "download": "Descargar Informe (PDF)",
        "btnLogs": "Ver Registros",
        "status": {
          "clean": "Limpio",
          "warning": "Advertencia",
          "critical": "Crítico"
        },
        "times": {
          "2m": "Hace 2 min",
          "1h": "Hace 1 hora",
          "5h": "Hace 5 horas"
        }
      },
      "scan": {
        "title": "Escáner de Código",
        "subtitle": "Escanea tu repositorio o directorio local al instante. Aegis AI detecta inyecciones SQL, XSS y secretos codificados en segundos.",
        "dropTitle": "Arrastra tu código aquí",
        "dropDesc": "o haz clic para seleccionar manualmente",
        "or": "O",
        "btnFile": "Seleccionar Archivo (.zip)",
        "btnFolder": "Directorio",
        "quota": "Cuota:",
        "left": "Restantes (Plan Starter) —",
        "unlimited": "para acceso ilimitado.",
        "scanRepo": "Escanear Repo",
        "autoScan": "Programar Auto-Scan (Pro)",
        "history": "Escaneos Recientes",
        "noHistory": "No hay historial aún.",
        "vulnFound": "vulnerabilidades",
        "viewReport": "Ver Informe",
        "quotaExceeded": "Cuota Excedida",
        "premiumAutoScan": "Función Premium: Auto-Scan",
        "quotaMsg": "Has usado tus 10 escaneos gratuitos. Actualiza a Pro ahora.",
        "autoScanMsg": "Programa escaneos diarios automáticos. Actualiza a Pro ahora.",
        "simulate": "Simular Pago y Actualizar ($49)",
        "cancel": "Cancelar",
        "loading": "Analizando Código..."
      },
      "report": {
        "title": "Informe de Análisis de Código",
        "back": "Volver",
        "downloadPdf": "Descargar PDF",
        "score": "Puntuación",
        "status": "Estado",
        "totalVulns": "Vulnerabilidades",
        "conclusion": "Conclusión de Aegis",
        "vulnDetails": "Detalles de Vulnerabilidad",
        "noVulns": "No se encontraron vulnerabilidades.",
        "line": "Línea",
        "desc": "Descripción",
        "recommendation": "Recomendación",
        "fixedCode": "Solución Sugerida",
        "copyJira": "Copiar a Jira"
      },
      "integration": {
        "title": "Integración CI/CD",
        "subtitle": "Automatice la seguridad en su ciclo de vida de desarrollo de software (SDLC). Prevenga vulnerabilidades antes de producción.",
        "ghActions": "GitHub Actions",
        "ghActionsDesc": "Guarde este archivo como .github/workflows/aegis.yml en su repositorio. Aegis AI escaneará cada Push y PR.",
        "copy": "Copiar Script",
        "copied": "¡Copiado!",
        "comingSoon": "GitLab CI y Jenkins (Próximamente)",
        "comingSoonDesc": "El soporte oficial está en desarrollo."
      },
      "login": { "title": "Bienvenido de nuevo", "subtitle": "Inicie sesión en Aegis AI", "email": "Correo electrónico", "password": "Contraseña", "btn": "Iniciar sesión", "noAccount": "¿No tienes cuenta?", "register": "Regístrate aquí", "remember": "Recuérdame", "forgot": "¿Olvidaste tu contraseña?" },
      "register": { "title": "Crear Cuenta", "subtitle": "Únete a Aegis AI hoy", "username": "Usuario", "email": "Correo", "password": "Contraseña", "btn": "Registrarse", "hasAccount": "¿Ya tienes una cuenta?", "login": "Inicia sesión" },
      "pricing": { 
        "title": "Precios Simples", 
        "subtitle": "Elija el plan adecuado para la seguridad de su equipo.", 
        "btnPro": "Mejorar a Pro", 
        "btnStarter": "Comenzar", 
        "month": "/mes",
        "cards": {
          "starterDesc": "Protección esencial para desarrolladores independientes y aficionados.",
          "mostPopular": "MÁS POPULAR",
          "proDesc": "Protección de grado militar. Desbloquee todas las funciones de Aegis Core para profesionales.",
          "teamDesc": "Infraestructura masiva para agencias y equipos empresariales de DevSecOps.",
          "contactSales": "Contactar Ventas"
        },
        "features": {
          "manualScan": "Escaneo Manual",
          "maxFiles": "Máx 10 Archivos / Mes",
          "basicReport": "Informe de Vulnerabilidad Básico",
          "autoPatch": "Función Aegis Auto-Patch",
          "queuePriority": "Prioridad de Análisis de Cola",
          "unlimitedScan": "Escaneo Ilimitado",
          "fullAutoPatch": "✨ Acceso Total a Aegis Auto-Patch",
          "zeroDay": "Detección de Vulnerabilidades Zero-Day",
          "ide": "Integración IDE (VSCode, JetBrains)",
          "priorityLine": "Línea de Análisis Prioritaria",
          "allPro": "Todas las Funciones Pro",
          "teamDashboard": "Panel de Equipo Centralizado",
          "api": "Acceso al Motor API de Aegis",
          "cicd": "Integración de Pipeline CI/CD",
          "support": "Soporte Prioritario 24/7"
        },
        "compare": "Comparar Características",
        "thFeatures": "Características",
        "faqTitle": "Preguntas Frecuentes",
        "compareRows": {
          "row1": "Escaneos por Mes",
          "unlimited": "Ilimitado",
          "row2": "Correcciones Auto-Patch",
          "row3": "Detección Zero-Day",
          "row4": "Extensiones IDE",
          "row5": "Panel de Análisis de Equipo",
          "row6": "Webhooks CI/CD Personalizados",
          "row7": "Acceso a API",
          "row8": "Nivel de Soporte",
          "community": "Comunidad",
          "priority": "Prioridad por Correo",
          "dedicated": "Dedicado 24/7"
        },
        "faqs": {
          "q1": "¿Hay contratos vinculantes?",
          "a1": "No. Puedes cancelar o cambiar tu plan en cualquier momento sin tarifas ocultas.",
          "q2": "¿Cómo se calcula el plan de Equipo?",
          "a2": "El plan se calcula por usuario. Puedes añadir o quitar miembros desde el panel de administración.",
          "q3": "¿Aegis AI almacena mi código fuente?",
          "a3": "No. Su código se escanea en memoria y se elimina inmediatamente al generar el informe.",
          "q4": "¿Qué es la detección Zero-Day?",
          "a4": "Los modelos de IA se actualizan constantemente para detectar nuevas vulnerabilidades no documentadas."
        }
      },
      "checkout": { "title": "Pagar", "subtitle": "Complete su actualización a PRO", "card": "Detalles de Tarjeta", "pay": "Pagar Ahora", "success": "¡Pago Exitoso!" },
      "about": { "title": "Sobre Nosotros", "subtitle": "Asegurando el código del mundo", "content": "Somos un equipo de investigadores construyendo el futuro." },
      "blog": { "title": "Blog de Aegis", "subtitle": "Últimas noticias", "readMore": "Leer más" },
      "contact": { "title": "Contáctenos", "subtitle": "Nos encantaría escucharte", "name": "Tu Nombre", "email": "Correo de la Empresa", "message": "Tu Mensaje", "send": "Enviar", "successTitle": "¡Mensaje Enviado!", "successDesc": "Nuestro equipo de especialistas se comunicará contigo en 24 horas." }
    }
  },
  id: {
    translation: {
      "nav": {
        "home": "Beranda",
        "dashboard": "Dasbor",
        "scan": "Pindai Manual",
        "connect": "Hubungkan GitHub",
        "integrations": "Integrations",
        "upgrade": "Tingkatkan",
        "login": "Masuk"
      },
      "auth": {
        "or": "ATAU",
        "backHome": "Kembali ke Beranda",
        "google": "Lanjutkan dengan Google",
        "github": "Lanjutkan dengan GitHub"
      },
      "landing": {
        "badge": "Masa Depan Keamanan Kode Ada di Sini",
        "title1": "Jangan Pernah Merge ",
        "titleHighlight": "Celah Keamanan",
        "title2": " Lagi.",
        "desc": "Aegis AI bertindak sebagai teknisi keamanan senior Anda, secara otomatis mereview setiap Pull Request untuk mencari bug kritis dan kerentanan sebelum masuk ke produksi.",
        "btnStart": "Mulai Gratis",
        "btnDemo": "Lihat Demo",
        "mockup": {
          "commit": "feat: perbarui alur autentikasi",
          "alert": "Celah Kritis Terdeteksi: SQL Injection",
          "desc": "Parameter userInput digabungkan langsung ke dalam kueri database tanpa sanitasi.",
          "btnFix": "Terapkan Perbaikan"
        },
        "features": {
          "f1": { "title": "Deteksi Zero-Day", "desc": "Mesin AI kami dilatih dengan jutaan repositori open-source untuk mendeteksi pola bahaya sebelum dipublikasikan." },
          "f2": { "title": "Analisis Kontekstual", "desc": "Aegis tidak sekadar mencari pola (grep). Ia memahami alur data dan arsitektur di seluruh basis kode Anda." },
          "f3": { "title": "Perbaikan Satu Klik", "desc": "Dapatkan solusi langsung di PR Anda. Cukup klik 'Commit suggestion' untuk menyelesaikan masalah dalam hitungan detik." }
        }
      },
      "dashboard": {
        "title": "Dasbor Keamanan",
        "subtitle": "Selamat datang kembali, skor keamanan Anda terlihat baik hari ini.",
        "btnSync": "Sinkronkan Repos",
        "scoreTitle": "Skor Keamanan Total",
        "scoreDelta": "+5 minggu ini",
        "reposTitle": "Repositori Dipantau",
        "vulnTitle": "Bug Kritis Dicegah",
        "tableTitle": "Daftar Repositori",
        "trendTitle": "Tren Bug Keamanan (30 Hari)",
        "distTitle": "Distribusi Tingkat Bahaya",
        "vulnLabel": "Celah Ditemukan",
        "thRepo": "Repositori",
        "thStatus": "Status",
        "thIssues": "Isu Terbuka",
        "thScan": "Pemindaian Terakhir",
        "thAction": "Aksi",
        "locked": "Dashboard Terkunci",
        "lockedDesc": "Analitik tingkat lanjut, metrik tren, dan manajemen multi-repositori eksklusif untuk pengguna",
        "upgradePro": "Upgrade ke Pro",
        "noData": "Tidak ada data yang cocok.",
        "download": "Unduh Laporan (PDF)",
        "btnLogs": "Lihat Log",
        "status": {
          "clean": "Aman",
          "warning": "Peringatan",
          "critical": "Kritis"
        },
        "times": {
          "2m": "2 menit lalu",
          "1h": "1 jam lalu",
          "5h": "5 jam lalu"
        }
      },
      "scan": {
        "title": "Pemindai Kode (Aegis AI)",
        "subtitle": "Pindai repositori atau folder kode lokal Anda secara instan. Aegis AI mendeteksi SQL Injection, XSS, dan kunci rahasia dalam hitungan detik.",
        "dropTitle": "Seret & Lepas arsip Anda di sini",
        "dropDesc": "atau klik untuk memilih file secara manual",
        "or": "ATAU",
        "btnFile": "Pilih Arsip (.zip)",
        "btnFolder": "Folder Lokal",
        "quota": "Kuota Pemindaian:",
        "left": "Tersisa (Paket Starter) —",
        "unlimited": "untuk akses tak terbatas.",
        "scanRepo": "Scan Repo",
        "autoScan": "Jadwalkan Pemindaian Otomatis (Pro)",
        "history": "Riwayat Pemindaian Terakhir",
        "noHistory": "Belum ada riwayat pemindaian.",
        "vulnFound": "celah keamanan ditemukan",
        "viewReport": "Lihat Laporan",
        "quotaExceeded": "Batas Kuota Pemindaian Telah Habis",
        "premiumAutoScan": "Fitur Premium: Auto-Scan",
        "quotaMsg": "Anda telah menggunakan seluruh 10 kuota gratis pemindaian paket Starter. Upgrade ke paket Pro sekarang untuk mendapatkan akses pemindaian tanpa batas, perlindungan real-time, dan laporan kepatuhan (Compliance Report).",
        "autoScanMsg": "Jadwalkan pemindaian otomatis setiap hari secara tersembunyi. Upgrade ke paket Pro sekarang untuk membuka fitur otomatisasi penuh, akses pemindaian tanpa batas, dan perlindungan real-time.",
        "simulate": "Simulasikan Pembayaran & Upgrade ($49)",
        "cancel": "Batal",
        "loading": "Menganalisis Kode..."
      },
      "report": {
        "title": "Laporan Analisis Kode",
        "back": "Kembali",
        "downloadPdf": "Unduh PDF",
        "score": "Skor Keselamatan",
        "status": "Status Sistem",
        "totalVulns": "Total Celah",
        "conclusion": "Kesimpulan Aegis Core",
        "vulnDetails": "Detail Kerentanan",
        "noVulns": "Tidak ada celah keamanan. Kode bersih dan aman.",
        "line": "Baris",
        "desc": "Deskripsi",
        "recommendation": "Rekomendasi",
        "fixedCode": "Saran Perbaikan",
        "copyJira": "Salin Tiket Jira"
      },
      "integration": {
        "title": "Integrasi Pipeline CI/CD",
        "subtitle": "Jadikan keamanan sebagai bagian otomatis dari siklus hidup pengembangan perangkat lunak (SDLC) Anda. Cegah kerentanan sebelum mencapai produksi.",
        "ghActions": "GitHub Actions",
        "ghActionsDesc": "Salin konfigurasi workflow di bawah ini dan simpan sebagai file .github/workflows/aegis.yml di repositori Anda. Aegis AI akan memindai setiap Push dan Pull Request secara otomatis.",
        "copy": "Salin Skrip",
        "copied": "Tersalin!",
        "comingSoon": "GitLab CI & Jenkins (Coming Soon)",
        "comingSoonDesc": "Dukungan resmi untuk integrasi GitLab CI/CD, Jenkins, dan Bitbucket Pipelines sedang dalam tahap pengembangan dan akan segera dirilis pada versi enterprise berikutnya."
      },
      "login": { "title": "Selamat Datang", "subtitle": "Masuk ke Aegis AI", "email": "Alamat Email", "password": "Kata Sandi", "btn": "Masuk", "noAccount": "Belum punya akun?", "register": "Daftar di sini", "remember": "Ingat saya", "forgot": "Lupa Kata Sandi?" },
      "register": { "title": "Buat Akun", "subtitle": "Bergabunglah dengan Aegis AI", "username": "Nama Pengguna", "email": "Email", "password": "Kata Sandi", "btn": "Daftar", "hasAccount": "Sudah punya akun?", "login": "Masuk" },
      "pricing": { 
        "title": "Harga Transparan", 
        "subtitle": "Pilih paket yang tepat untuk tim Anda.", 
        "btnPro": "Tingkatkan ke Pro", 
        "btnStarter": "Mulai Gratis", 
        "month": "/bln",
        "cards": {
          "starterDesc": "Perlindungan esensial untuk developer independen dan hobiis.",
          "mostPopular": "PALING POPULER",
          "proDesc": "Perlindungan tingkat militer. Buka semua fitur Aegis Core untuk profesional.",
          "teamDesc": "Infrastruktur masif untuk tim DevSecOps perusahaan dan agensi.",
          "contactSales": "Hubungi Sales"
        },
        "features": {
          "manualScan": "Pemindaian Manual",
          "maxFiles": "Maks. 10 File / Bulan",
          "basicReport": "Laporan Kerentanan Dasar",
          "autoPatch": "Fitur Aegis Auto-Patch",
          "queuePriority": "Prioritas Analisis Antrean",
          "unlimitedScan": "Pemindaian Tanpa Batas",
          "fullAutoPatch": "✨ Akses Penuh Aegis Auto-Patch",
          "zeroDay": "Deteksi Zero-Day Vulnerability",
          "ide": "Integrasi IDE (VSCode, JetBrains)",
          "priorityLine": "Jalur Analisis Prioritas",
          "allPro": "Semua Fitur Paket Pro",
          "teamDashboard": "Dashboard Tim Terpusat",
          "api": "Akses Aegis API Engine",
          "cicd": "Integrasi Pipeline CI/CD",
          "support": "Dukungan Prioritas 24/7"
        },
        "compare": "Bandingkan Fitur",
        "thFeatures": "Fitur",
        "faqTitle": "Tanya Jawab (FAQ) Harga",
        "compareRows": {
          "row1": "Pemindaian per Bulan",
          "unlimited": "Tanpa Batas",
          "row2": "Perbaikan Auto-Patch",
          "row3": "Deteksi Zero-Day",
          "row4": "Ekstensi IDE",
          "row5": "Dashboard Analitik Tim",
          "row6": "Webhooks CI/CD Kustom",
          "row7": "Akses API",
          "row8": "Tingkat Dukungan",
          "community": "Komunitas",
          "priority": "Prioritas (Email)",
          "dedicated": "Khusus 24/7"
        },
        "faqs": {
          "q1": "Apakah ada kontrak mengikat?",
          "a1": "Tidak ada. Anda dapat membatalkan atau mengubah paket berlangganan kapan saja tanpa biaya tersembunyi.",
          "q2": "Bagaimana penghitungan untuk paket Team?",
          "a2": "Paket Team dihitung per pengguna (seat). Anda bisa menambah atau mengurangi jumlah anggota tim kapan saja dari dashboard admin.",
          "q3": "Apakah Aegis AI menyimpan kode sumber saya?",
          "a3": "Tidak. Kode sumber Anda dipindai langsung di memori dan langsung dihapus seketika setelah laporan dihasilkan.",
          "q4": "Apa itu deteksi Zero-Day?",
          "a4": "Fitur Pro dan Team menggunakan model AI yang terus diperbarui untuk mendeteksi celah keamanan baru yang belum didokumentasikan di database CVE publik."
        }
      },
      "checkout": { "title": "Pembayaran", "subtitle": "Selesaikan upgrade PRO Anda", "card": "Detail Kartu", "pay": "Bayar Sekarang", "success": "Pembayaran Berhasil!" },
      "about": { "title": "Tentang Kami", "subtitle": "Mengamankan kode dunia", "content": "Kami adalah tim peneliti keamanan." },
      "blog": { "title": "Blog Aegis", "subtitle": "Berita terbaru", "readMore": "Baca Selengkapnya" },
      "contact": { "title": "Hubungi Kami", "subtitle": "Kami ingin mendengar dari Anda", "name": "Nama Anda", "email": "Email Perusahaan", "message": "Pesan Anda", "send": "Kirim Pesan", "successTitle": "Pesan Terkirim!", "successDesc": "Tim spesialis kami akan segera menghubungi Anda kembali dalam waktu 1x24 jam." }
    }
  },
  ja: {
    translation: {
      "nav": {
        "home": "ホーム",
        "dashboard": "ダッシュボード",
        "scan": "手動スキャン",
        "connect": "GitHubを連携",
        "integrations": "インテグレーション",
        "upgrade": "アップグレード",
        "login": "ログイン"
      },
      "auth": {
        "or": "または",
        "backHome": "ホームに戻る",
        "google": "Googleで続ける",
        "github": "GitHubで続ける"
      },
      "landing": {
        "badge": "コードセキュリティの未来がここに",
        "title1": "もう",
        "titleHighlight": "脆弱性",
        "title2": "をマージしない。",
        "desc": "Aegis AIは、本番環境に達する前に、すべてのプルリクエストの重大なバグやシークレットを自動的にレビューする上級セキュリティエンジニアとして機能します。",
        "btnStart": "無料で始める",
        "btnDemo": "デモを見る",
        "mockup": {
          "commit": "feat: 認証フローを更新",
          "alert": "重大な脆弱性が検出されました: SQLインジェクション",
          "desc": "42行目のパラメータuserInputが、サニタイズされずにデータベースクエリに直接連結されています。",
          "btnFix": "修正を適用"
        },
        "features": {
          "f1": { "title": "ゼロデイ検出", "desc": "AIエンジンは何百万ものオープンソースの脆弱性でトレーニングされ、公開前にパターンを検出します。" },
          "f2": { "title": "コンテキスト対応分析", "desc": "Aegisは単に悪いパターンをgrepするだけではありません。コードベース全体のデータフローを理解します。" },
          "f3": { "title": "ワンクリック修正", "desc": "PRで実行可能な修正を取得します。「提案をコミット」をクリックするだけで即座に解決します。" }
        }
      },
      "dashboard": {
        "title": "セキュリティダッシュボード",
        "subtitle": "お帰りなさい、今日のセキュリティは良好です。",
        "btnSync": "リポジトリを同期",
        "scoreTitle": "総合セキュリティスコア",
        "scoreDelta": "今週 +5",
        "reposTitle": "監視対象リポジトリ",
        "vulnTitle": "防止された脆弱性",
        "tableTitle": "監視対象リポジトリ",
        "trendTitle": "脆弱性の傾向 (30日間)",
        "distTitle": "重大度の分布",
        "vulnLabel": "脆弱性",
        "thRepo": "リポジトリ",
        "thStatus": "ステータス",
        "thIssues": "未解決の問題",
        "thScan": "前回のスキャン",
        "thAction": "アクション",
        "locked": "ダッシュボードがロックされました",
        "lockedDesc": "高度な分析、トレンド指標、マルチリポジトリ管理はProユーザー専用です。",
        "upgradePro": "Proにアップグレード",
        "noData": "一致するデータが見つかりません。",
        "download": "レポートをダウンロード (PDF)",
        "btnLogs": "ログを表示",
        "status": {
          "clean": "安全",
          "warning": "警告",
          "critical": "重大"
        },
        "times": {
          "2m": "2分前",
          "1h": "1時間前",
          "5h": "5時間前"
        }
      },
      "scan": {
        "title": "コードスキャナー",
        "subtitle": "リポジトリまたはローカルコードディレクトリを即座にスキャンします。",
        "dropTitle": "ここにコードをドラッグ＆ドロップ",
        "dropDesc": "またはクリックしてファイルを手動で選択",
        "or": "または",
        "btnFile": "アーカイブを選択 (.zip)",
        "btnFolder": "ディレクトリ",
        "quota": "スキャンクォータ:",
        "left": "残り (スタータープラン) —",
        "unlimited": "無制限アクセス用。",
        "scanRepo": "リポジトリをスキャン",
        "autoScan": "自動スキャンのスケジュール (Pro)",
        "history": "最近のスキャン",
        "noHistory": "スキャン履歴はまだありません。",
        "vulnFound": "個の脆弱性が見つかりました",
        "viewReport": "レポートを見る",
        "quotaExceeded": "クォータ超過",
        "premiumAutoScan": "プレミアム機能：自動スキャン",
        "quotaMsg": "10回の無料スキャンを使い切りました。",
        "autoScanMsg": "毎日の自動スキャンをスケジュールします。",
        "simulate": "支払いをシミュレート ($49)",
        "cancel": "キャンセル",
        "loading": "コードベースを分析中..."
      },
      "report": {
        "title": "コード分析レポート",
        "back": "戻る",
        "downloadPdf": "PDFをダウンロード",
        "score": "セキュリティスコア",
        "status": "システムステータス",
        "totalVulns": "合計の脆弱性",
        "conclusion": "Aegis Coreの結論",
        "vulnDetails": "脆弱性の詳細",
        "noVulns": "脆弱性は見つかりませんでした。コードは安全です。",
        "line": "行",
        "desc": "説明",
        "recommendation": "推奨事項",
        "fixedCode": "修正案",
        "copyJira": "Jiraにコピー"
      },
      "integration": {
        "title": "CI/CD パイプライン統合",
        "subtitle": "ソフトウェア開発ライフサイクル (SDLC) の一部としてセキュリティを自動化します。本番環境に到達する前に脆弱性を防ぎます。",
        "ghActions": "GitHub Actions",
        "ghActionsDesc": "以下のワークフロー構成をコピーして、リポジトリに .github/workflows/aegis.yml ファイルとして保存します。 Aegis AI は、すべての Push と Pull Request を自動的にスキャンします。",
        "copy": "スクリプトをコピー",
        "copied": "コピーしました！",
        "comingSoon": "GitLab CI & Jenkins (近日公開)",
        "comingSoonDesc": "GitLab CI/CD、Jenkins、Bitbucket Pipelines の公式サポートは現在開発中であり、次のエンタープライズ バージョンでリリースされる予定です。"
      },
      "login": { "title": "お帰りなさい", "subtitle": "Aegis AIにサインイン", "email": "メールアドレス", "password": "パスワード", "btn": "サインイン", "noAccount": "アカウントをお持ちでないですか？", "register": "登録はこちら", "remember": "ログイン状態を保持", "forgot": "パスワードを忘れた場合" },
      "register": { "title": "アカウント作成", "subtitle": "Aegis AIに参加", "username": "ユーザー名", "email": "メール", "password": "パスワード", "btn": "サインアップ", "hasAccount": "すでにアカウントをお持ちですか？", "login": "ログイン" },
      "pricing": { 
        "title": "シンプルな料金体系", 
        "subtitle": "チームに最適なプランを選択してください。", 
        "btnPro": "Proにアップグレード", 
        "btnStarter": "始める", 
        "month": "/月",
        "cards": {
          "starterDesc": "独立した開発者や愛好家のための不可欠な保護。",
          "mostPopular": "一番人気",
          "proDesc": "軍用グレードの保護。プロフェッショナル向けのすべてのAegis Core機能をロック解除します。",
          "teamDesc": "エンタープライズDevSecOpsチームとエージェンシーのための大規模インフラストラクチャ。",
          "contactSales": "営業に連絡"
        },
        "features": {
          "manualScan": "手動スキャン",
          "maxFiles": "最大10ファイル/月",
          "basicReport": "基本的な脆弱性レポート",
          "autoPatch": "Aegis Auto-Patch機能",
          "queuePriority": "分析キューの優先度",
          "unlimitedScan": "無制限のスキャン",
          "fullAutoPatch": "✨ Aegis Auto-Patchへのフルアクセス",
          "zeroDay": "ゼロデイ脆弱性の検出",
          "ide": "IDE統合 (VSCode, JetBrains)",
          "priorityLine": "優先分析ライン",
          "allPro": "すべてのPro機能",
          "teamDashboard": "集中型チームダッシュボード",
          "api": "Aegis APIエンジンのアクセス",
          "cicd": "CI/CDパイプラインの統合",
          "support": "24時間年中無休の優先サポート"
        },
        "compare": "機能の比較",
        "thFeatures": "機能",
        "faqTitle": "よくある質問",
        "compareRows": {
          "row1": "月間スキャン数",
          "unlimited": "無制限",
          "row2": "Auto-Patch修正",
          "row3": "ゼロデイ検出",
          "row4": "IDE拡張機能",
          "row5": "チーム分析ダッシュボード",
          "row6": "カスタムCI/CD Webhook",
          "row7": "APIアクセス",
          "row8": "サポートレベル",
          "community": "コミュニティ",
          "priority": "優先メール",
          "dedicated": "24時間体制"
        },
        "faqs": {
          "q1": "拘束力のある契約はありますか？",
          "a1": "ありません。隠れた費用なしでいつでもキャンセルまたは変更できます。",
          "q2": "チームプランの計算方法は？",
          "a2": "ユーザー（シート）ごとに計算されます。いつでもメンバーを追加/削除できます。",
          "q3": "Aegis AIは私のソースコードを保存しますか？",
          "a3": "いいえ。メモリ内でスキャンされ、レポート生成後に直ちに削除されます。",
          "q4": "ゼロデイ検出とは何ですか？",
          "a4": "CVEデータベースにまだ文書化されていない新しい脆弱性を検出するために、常に更新されるAIモデルを使用します。"
        }
      },
      "checkout": { "title": "チェックアウト", "subtitle": "PROへのアップグレードを完了", "card": "カード詳細", "pay": "今すぐ支払う", "success": "支払い成功！" },
      "about": { "title": "私たちについて", "subtitle": "世界のコードを保護する", "content": "私たちはセキュリティ研究者のチームです。" },
      "blog": { "title": "Aegis ブログ", "subtitle": "最新ニュース", "readMore": "続きを読む" },
      "contact": { "title": "お問い合わせ", "subtitle": "ご連絡をお待ちしております", "name": "お名前", "email": "会社用メールアドレス", "message": "メッセージ", "send": "送信", "successTitle": "送信完了しました！", "successDesc": "担当チームより24時間以内にご連絡いたします。" }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
