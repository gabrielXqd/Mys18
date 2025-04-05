// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJjOyVe_7ShAm2JFDYh_IlRDKO8TgUgdw",
  authDomain: "convite-aniversario-18.firebaseapp.com",
  projectId: "convite-aniversario-18",
  storageBucket: "convite-aniversario-18.appspot.com",
  messagingSenderId: "123456789012",
  databaseURL: "https://convite-aniversario-18-default-rtdb.firebaseio.com",
  appId: "1:123456789012:web:1234567890abcdef"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao banco de dados
const database = firebase.database();

// Exportar a referência do banco de dados
window.firebaseDB = database;