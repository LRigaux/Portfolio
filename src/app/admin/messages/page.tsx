'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Charger les messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/messages');
        
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des messages');
        }
        
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les messages. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  // Filtrer les messages
  const filteredMessages = messages.filter(message => {
    if (filter === 'read') return message.isRead;
    if (filter === 'unread') return !message.isRead;
    return true;
  });

  // Marquer un message comme lu
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du message');
      }
      
      // Mettre à jour l'état local
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
      
      // Mettre à jour le message sélectionné si nécessaire
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour du message');
    }
  };

  // Supprimer un message
  const deleteMessage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du message');
      }
      
      // Mettre à jour l'état local
      setMessages(messages.filter(msg => msg.id !== id));
      
      // Réinitialiser le message sélectionné si nécessaire
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression du message');
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Données de test en attendant l'implémentation de l'API
  const dummyMessages: ContactMessage[] = [
    {
      id: '1',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      subject: 'Demande de collaboration',
      message: 'Bonjour, je suis intéressée par vos services de data science. Pourrions-nous discuter d\'une potentielle collaboration sur un projet d\'analyse de données ?',
      isRead: false,
      createdAt: new Date(2023, 5, 15).toISOString(),
    },
    {
      id: '2',
      name: 'Thomas Dubois',
      email: 'thomas.dubois@example.com',
      subject: 'Question sur vos compétences en IA',
      message: 'Salut, j\'ai vu vos projets en intelligence artificielle et je suis impressionné. J\'aimerais savoir si vous êtes disponible pour un projet de reconnaissance d\'images...',
      isRead: true,
      createdAt: new Date(2023, 5, 10).toISOString(),
    },
    {
      id: '3',
      name: 'Julie Leclerc',
      email: 'julie.leclerc@example.com',
      subject: 'Demande de devis',
      message: 'Bonjour, nous sommes une startup spécialisée dans la fintech et nous recherchons un data scientist pour nous aider à développer des algorithmes de détection de fraude...',
      isRead: false,
      createdAt: new Date(2023, 5, 5).toISOString(),
    }
  ];

  // Utiliser les données de test si l'API n'est pas encore implémentée
  useEffect(() => {
    if (!loading && messages.length === 0 && !error) {
      setMessages(dummyMessages);
    }
  }, [loading, messages.length, error]);

  return (
    <div className="px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className={`text-2xl font-bold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
          Messages <span className={isDark ? 'text-shadow-blue' : 'text-light-primary'}>({filteredMessages.length})</span>
        </h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? isDark ? 'bg-shadow-blue text-white' : 'bg-light-primary text-white'
                : isDark ? 'bg-shadow-surface text-shadow-text' : 'bg-light-surface text-light-text'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === 'unread'
                ? isDark ? 'bg-shadow-blue text-white' : 'bg-light-primary text-white'
                : isDark ? 'bg-shadow-surface text-shadow-text' : 'bg-light-surface text-light-text'
            }`}
          >
            Non lus
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === 'read'
                ? isDark ? 'bg-shadow-blue text-white' : 'bg-light-primary text-white'
                : isDark ? 'bg-shadow-surface text-shadow-text' : 'bg-light-surface text-light-text'
            }`}
          >
            Lus
          </button>
        </div>
      </motion.div>
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            isDark ? 'border-shadow-primary' : 'border-light-primary'
          }`}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className={`
            col-span-1 rounded-lg overflow-hidden
            ${isDark ? 'bg-shadow-secondary border border-shadow-primary/20' : 'bg-light-secondary border border-light-primary/20'}
          `}>
            <div className={`
              py-3 px-4
              ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
            `}>
              <h2 className={`font-medium ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                Messages
              </h2>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {filteredMessages.length === 0 ? (
                <div className="py-6 text-center">
                  <p className={isDark ? 'text-shadow-text/70' : 'text-light-text/70'}>
                    Aucun message {filter !== 'all' ? (filter === 'unread' ? 'non lu' : 'lu') : ''}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {filteredMessages.map((message) => (
                    <li 
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) {
                          markAsRead(message.id);
                        }
                      }}
                      className={`
                        px-4 py-3 cursor-pointer transition-colors
                        ${selectedMessage?.id === message.id
                          ? isDark ? 'bg-shadow-primary/20' : 'bg-light-primary/20'
                          : isDark ? 'hover:bg-shadow-surface' : 'hover:bg-light-surface'
                        }
                        ${!message.isRead ? 'border-l-4 border-shadow-blue' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'} ${!message.isRead ? 'font-bold' : ''}`}>
                          {message.name}
                        </h3>
                        <span className="text-xs text-shadow-text/60">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                        {message.subject}
                      </p>
                      <p className={`text-xs truncate mt-1 ${isDark ? 'text-shadow-text/60' : 'text-light-text/60'}`}>
                        {message.message.substring(0, 50)}...
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Détail du message */}
          <div className={`
            col-span-1 lg:col-span-2 rounded-lg overflow-hidden
            ${isDark ? 'bg-shadow-secondary border border-shadow-primary/20' : 'bg-light-secondary border border-light-primary/20'}
            ${!selectedMessage ? 'flex items-center justify-center' : ''}
          `}>
            {!selectedMessage ? (
              <div className="text-center py-12 px-6">
                <svg className="mx-auto h-12 w-12 text-shadow-text/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className={`mt-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Sélectionnez un message pour afficher son contenu
                </h3>
              </div>
            ) : (
              <>
                <div className={`
                  py-3 px-4 flex justify-between items-center
                  ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
                `}>
                  <h2 className={`font-medium ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className={`
                        p-1.5 rounded transition-colors
                        ${isDark ? 'hover:bg-shadow-monarch/30 text-shadow-monarch' : 'hover:bg-red-100 text-red-600'}
                      `}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className={`font-bold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                          {selectedMessage.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                          {selectedMessage.email}
                        </p>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-shadow-text/60' : 'text-light-text/60'}`}>
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                    
                    <div className={`
                      p-4 rounded-lg
                      ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
                    `}>
                      <p className={`whitespace-pre-line ${isDark ? 'text-shadow-text/90' : 'text-light-text/90'}`}>
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8">
                    <div className={`
                      px-2 py-1 rounded-full text-xs
                      ${selectedMessage.isRead
                        ? isDark ? 'bg-shadow-accent/20 text-shadow-accent' : 'bg-green-100 text-green-800'
                        : isDark ? 'bg-shadow-blue/20 text-shadow-blue' : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {selectedMessage.isRead ? 'Lu' : 'Non lu'}
                    </div>
                    
                    <div className="flex space-x-2">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className={`
                          px-4 py-2 rounded text-sm font-medium
                          ${isDark 
                            ? 'bg-shadow-primary text-white hover:bg-shadow-accent' 
                            : 'bg-light-primary text-white hover:bg-light-accent'}
                          transition-colors
                        `}
                      >
                        Répondre
                      </a>
                      
                      {!selectedMessage.isRead && (
                        <button
                          onClick={() => markAsRead(selectedMessage.id)}
                          className={`
                            px-4 py-2 rounded text-sm font-medium
                            ${isDark 
                              ? 'bg-shadow-surface text-shadow-text hover:bg-shadow-surface/80' 
                              : 'bg-light-surface text-light-text hover:bg-light-surface/80'}
                            transition-colors
                          `}
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 