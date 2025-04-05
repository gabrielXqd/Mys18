// Arquivo para armazenar e gerenciar os dados de confirmação

const GuestData = {
    // Array para armazenar os dados dos convidados
    guests: [],

    // Método para adicionar um novo convidado
    addGuest: function(guest) {
        // Adiciona o convidado ao array
        this.guests.push(guest);
        // Salva os dados no Firebase
        this.saveToFirebase(guest);
        
        // Retorna o convidado adicionado
        return guest;
    },

    // Método para obter todos os convidados
    getAllGuests: function() {
        // Retorna o array de convidados
        return this.guests;
    },

    // Método para salvar um convidado no Firebase
    saveToFirebase: function(guest) {
        // Gera uma chave única para o convidado
        const newGuestRef = firebaseDB.ref('guests').push();
        
        // Salva os dados do convidado com a chave gerada
        newGuestRef.set(guest)
            .catch(error => {
                console.error('Erro ao salvar no Firebase:', error);
                // Fallback para localStorage em caso de erro
                this.saveToLocalStorage();
            });
    },

    // Método para carregar os dados do Firebase
    loadFromFirebase: function() {
        return new Promise((resolve, reject) => {
            firebaseDB.ref('guests').once('value')
                .then(snapshot => {
                    this.guests = [];
                    snapshot.forEach(childSnapshot => {
                        this.guests.push(childSnapshot.val());
                    });
                    resolve(this.guests);
                })
                .catch(error => {
                    console.error('Erro ao carregar do Firebase:', error);
                    // Fallback para localStorage em caso de erro
                    this.loadFromLocalStorage();
                    resolve(this.guests);
                });
        });
    },
    
    // Método para salvar os dados no localStorage (fallback)
    saveToLocalStorage: function() {
        localStorage.setItem('birthdayGuests', JSON.stringify(this.guests));
    },

    // Método para carregar os dados do localStorage (fallback)
    loadFromLocalStorage: function() {
        const storedData = localStorage.getItem('birthdayGuests');
        if (storedData) {
            this.guests = JSON.parse(storedData);
        }
    },

    // Método para exportar os dados como CSV
    exportAsCSV: function() {
        // Verifica se há convidados
        if (this.guests.length === 0) {
            return 'Nenhum convidado confirmado ainda.';
        }
        
        // Cabeçalho do CSV
        let csv = 'Nome,Telefone,Confirmação,Mensagem,Data\n';
        
        // Adiciona cada convidado ao CSV
        this.guests.forEach(guest => {
            csv += `"${guest.name}","${guest.phone}","${guest.attendance}","${guest.message || ''}","${guest.date}"\n`;
        });
        
        return csv;
    },
    
    // Método para configurar listeners em tempo real
    setupRealtimeListeners: function() {
        // Listener para adições de novos convidados
        firebaseDB.ref('guests').on('child_added', snapshot => {
            const guestExists = this.guests.some(g => 
                g.name === snapshot.val().name && 
                g.phone === snapshot.val().phone && 
                g.date === snapshot.val().date
            );
            
            if (!guestExists) {
                this.guests.push(snapshot.val());
                // Dispara um evento personalizado para notificar a interface
                document.dispatchEvent(new CustomEvent('guestDataUpdated'));
            }
        });
    }
};

// Inicializa carregando dados do Firebase
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o Firebase está disponível
    if (typeof firebaseDB !== 'undefined') {
        GuestData.loadFromFirebase().then(() => {
            GuestData.setupRealtimeListeners();
            // Dispara um evento para notificar que os dados foram carregados
            document.dispatchEvent(new CustomEvent('guestDataLoaded'));
        });
    } else {
        // Fallback para localStorage se o Firebase não estiver disponível
        GuestData.loadFromLocalStorage();
        console.warn('Firebase não disponível, usando localStorage como fallback');
    }
});

// Exporta o objeto GuestData
window.GuestData = GuestData;