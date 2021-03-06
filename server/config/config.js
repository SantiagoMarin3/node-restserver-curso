// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Vencimiento del token
// ===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h';

// ===========================
// Seed
// ===========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===========================
// Base de Datos
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ===========================
// Google Client ID
// ===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '579699347650-pegieso3i3uv555opdj4sgfvvoh3cpsv.apps.googleusercontent.com';