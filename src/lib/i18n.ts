export type Locale = 'es-ES' | 'es-LATAM' | 'en';

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'es-ES', label: 'Español (España)', flag: '🇪🇸' },
  { code: 'es-LATAM', label: 'Español (Latinoamérica)', flag: '🌎' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const translations = {
  'es-ES': {
    // Navigation
    'nav.home': 'Inicio',
    'nav.progress': 'Mi Progreso',
    'nav.help': 'Ayuda',
    
    // Welcome
    'welcome.title': 'Tu camino hacia el bienestar',
    'welcome.subtitle': 'Pequeños pasos diarios que transforman tu vida',
    'welcome.cta': 'Comenzar mi viaje',
    'welcome.continue': 'Continuar mi viaje',
    'welcome.tagline': 'Solo 10 minutos al día',
    
    // Journey
    'journey.day': 'Día',
    'journey.of': 'de',
    'journey.today': 'Hoy',
    'journey.start': 'Comenzar',
    'journey.continue': 'Continuar',
    'journey.completed': 'Completado',
    'journey.locked': 'Bloqueado',
    'journey.current': 'Jornada actual',
    'journey.greeting.morning': 'Buenos días',
    'journey.greeting.afternoon': 'Buenas tardes',
    'journey.greeting.evening': 'Buenas noches',
    
    // Content
    'content.video': 'Vídeo',
    'content.audio': 'Audio guiado',
    'content.download': 'Material descargable',
    'content.survey': 'Tu estado emocional',
    'content.practice': 'Práctica del día',
    'content.minutes': 'min',
    
    // Video
    'video.title': 'Reflexión del día',
    'video.watch': 'Ver vídeo',
    'video.next': 'Siguiente',
    
    // Audio
    'audio.title': 'Momento de calma',
    'audio.play': 'Reproducir',
    'audio.pause': 'Pausar',
    'audio.next': 'Siguiente',
    
    // Survey
    'survey.title': '¿Cómo te sientes ahora?',
    'survey.subtitle': 'Tu respuesta nos ayuda a personalizar tu experiencia',
    'survey.submit': 'Continuar',
    'mood.great': 'Genial',
    'mood.good': 'Bien',
    'mood.okay': 'Regular',
    'mood.low': 'Bajo',
    'mood.struggling': 'Difícil',
    
    // Closure
    'closure.title': '¡Bien hecho!',
    'closure.subtitle': 'Has completado el día',
    'closure.practice.title': 'Tu práctica para hoy',
    'closure.practice.reminder': 'Recuerda aplicar esto durante el día',
    'closure.next': 'Volver al inicio',
    'closure.share': 'Compartir logro',
    
    // Progress
    'progress.title': 'Tu progreso',
    'progress.completed': 'Días completados',
    'progress.streak': 'Racha actual',
    'progress.days': 'días',
    'progress.keep': '¡Sigue así!',
    
    // Common
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.skip': 'Saltar',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.retry': 'Reintentar',
    
    // Help
    'help.title': 'Estamos aquí para ayudarte',
    'help.faq': 'Preguntas frecuentes',
    'help.contact': 'Contactar',
    
    // Settings
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Oscuro',
    'settings.theme.system': 'Sistema',

    // Notifications
    'notifications.title': 'Notificaciones',
    'notifications.markAllRead': 'Marcar todo leído',
    'notifications.clearAll': 'Limpiar todo',
    'notifications.empty': 'No tienes notificaciones',
    'notifications.settings.title': 'Ajustes de notificaciones',
    'notifications.settings.description': 'Configura cómo y cuándo recibir recordatorios',
    'notifications.settings.enable': 'Activar notificaciones',
    'notifications.settings.enableDesc': 'Recibe recordatorios para mantener tu hábito',
    'notifications.settings.blocked': 'Las notificaciones están bloqueadas en tu navegador',
    'notifications.settings.dailyReminder': 'Recordatorio diario',
    'notifications.settings.dailyReminderDesc': 'Recibe un aviso cada día para hacer tu práctica',
    'notifications.settings.reminderEnabled': 'Activar recordatorio',
    'notifications.settings.time': 'Hora',
    'notifications.settings.streakReminder': 'Proteger racha',
    'notifications.settings.streakReminderDesc': 'Aviso si vas a perder tu racha',
    'notifications.settings.encouragement': 'Mensajes de ánimo',
    'notifications.settings.encouragementDesc': 'Recibe mensajes motivadores ocasionales',
  },
  'es-LATAM': {
    // Navigation
    'nav.home': 'Inicio',
    'nav.progress': 'Mi Progreso',
    'nav.help': 'Ayuda',
    
    // Welcome
    'welcome.title': 'Tu camino hacia el bienestar',
    'welcome.subtitle': 'Pequeños pasos diarios que transforman tu vida',
    'welcome.cta': 'Comenzar mi viaje',
    'welcome.continue': 'Continuar mi viaje',
    'welcome.tagline': 'Solo 10 minutos al día',
    
    // Journey
    'journey.day': 'Día',
    'journey.of': 'de',
    'journey.today': 'Hoy',
    'journey.start': 'Comenzar',
    'journey.continue': 'Continuar',
    'journey.completed': 'Completado',
    'journey.locked': 'Bloqueado',
    'journey.current': 'Jornada actual',
    'journey.greeting.morning': 'Buenos días',
    'journey.greeting.afternoon': 'Buenas tardes',
    'journey.greeting.evening': 'Buenas noches',
    
    // Content
    'content.video': 'Video',
    'content.audio': 'Audio guiado',
    'content.download': 'Material descargable',
    'content.survey': 'Tu estado emocional',
    'content.practice': 'Práctica del día',
    'content.minutes': 'min',
    
    // Video
    'video.title': 'Reflexión del día',
    'video.watch': 'Ver video',
    'video.next': 'Siguiente',
    
    // Audio
    'audio.title': 'Momento de calma',
    'audio.play': 'Reproducir',
    'audio.pause': 'Pausar',
    'audio.next': 'Siguiente',
    
    // Survey
    'survey.title': '¿Cómo te sientes ahora?',
    'survey.subtitle': 'Tu respuesta nos ayuda a personalizar tu experiencia',
    'survey.submit': 'Continuar',
    'mood.great': 'Genial',
    'mood.good': 'Bien',
    'mood.okay': 'Regular',
    'mood.low': 'Bajo',
    'mood.struggling': 'Difícil',
    
    // Closure
    'closure.title': '¡Muy bien!',
    'closure.subtitle': 'Completaste el día',
    'closure.practice.title': 'Tu práctica para hoy',
    'closure.practice.reminder': 'Recuerda aplicar esto durante el día',
    'closure.next': 'Volver al inicio',
    'closure.share': 'Compartir logro',
    
    // Progress
    'progress.title': 'Tu progreso',
    'progress.completed': 'Días completados',
    'progress.streak': 'Racha actual',
    'progress.days': 'días',
    'progress.keep': '¡Sigue así!',
    
    // Common
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.skip': 'Saltar',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.retry': 'Reintentar',
    
    // Help
    'help.title': 'Estamos aquí para ayudarte',
    'help.faq': 'Preguntas frecuentes',
    'help.contact': 'Contactar',
    
    // Settings
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Oscuro',
    'settings.theme.system': 'Sistema',

    // Notifications
    'notifications.title': 'Notificaciones',
    'notifications.markAllRead': 'Marcar todo leído',
    'notifications.clearAll': 'Limpiar todo',
    'notifications.empty': 'No tienes notificaciones',
    'notifications.settings.title': 'Ajustes de notificaciones',
    'notifications.settings.description': 'Configura cómo y cuándo recibir recordatorios',
    'notifications.settings.enable': 'Activar notificaciones',
    'notifications.settings.enableDesc': 'Recibe recordatorios para mantener tu hábito',
    'notifications.settings.blocked': 'Las notificaciones están bloqueadas en tu navegador',
    'notifications.settings.dailyReminder': 'Recordatorio diario',
    'notifications.settings.dailyReminderDesc': 'Recibe un aviso cada día para hacer tu práctica',
    'notifications.settings.reminderEnabled': 'Activar recordatorio',
    'notifications.settings.time': 'Hora',
    'notifications.settings.streakReminder': 'Proteger racha',
    'notifications.settings.streakReminderDesc': 'Aviso si vas a perder tu racha',
    'notifications.settings.encouragement': 'Mensajes de ánimo',
    'notifications.settings.encouragementDesc': 'Recibe mensajes motivadores ocasionales',
  },
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.progress': 'My Progress',
    'nav.help': 'Help',
    
    // Welcome
    'welcome.title': 'Your path to wellbeing',
    'welcome.subtitle': 'Small daily steps that transform your life',
    'welcome.cta': 'Start my journey',
    'welcome.continue': 'Continue my journey',
    'welcome.tagline': 'Just 10 minutes a day',
    
    // Journey
    'journey.day': 'Day',
    'journey.of': 'of',
    'journey.today': 'Today',
    'journey.start': 'Start',
    'journey.continue': 'Continue',
    'journey.completed': 'Completed',
    'journey.locked': 'Locked',
    'journey.current': 'Current journey',
    'journey.greeting.morning': 'Good morning',
    'journey.greeting.afternoon': 'Good afternoon',
    'journey.greeting.evening': 'Good evening',
    
    // Content
    'content.video': 'Video',
    'content.audio': 'Guided audio',
    'content.download': 'Downloadable material',
    'content.survey': 'Your emotional state',
    'content.practice': 'Today\'s practice',
    'content.minutes': 'min',
    
    // Video
    'video.title': 'Daily reflection',
    'video.watch': 'Watch video',
    'video.next': 'Next',
    
    // Audio
    'audio.title': 'Moment of calm',
    'audio.play': 'Play',
    'audio.pause': 'Pause',
    'audio.next': 'Next',
    
    // Survey
    'survey.title': 'How are you feeling now?',
    'survey.subtitle': 'Your answer helps us personalize your experience',
    'survey.submit': 'Continue',
    'mood.great': 'Great',
    'mood.good': 'Good',
    'mood.okay': 'Okay',
    'mood.low': 'Low',
    'mood.struggling': 'Struggling',
    
    // Closure
    'closure.title': 'Well done!',
    'closure.subtitle': 'You completed day',
    'closure.practice.title': 'Your practice for today',
    'closure.practice.reminder': 'Remember to apply this throughout your day',
    'closure.next': 'Back to home',
    'closure.share': 'Share achievement',
    
    // Progress
    'progress.title': 'Your progress',
    'progress.completed': 'Days completed',
    'progress.streak': 'Current streak',
    'progress.days': 'days',
    'progress.keep': 'Keep it up!',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.skip': 'Skip',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    
    // Help
    'help.title': 'We\'re here to help',
    'help.faq': 'FAQ',
    'help.contact': 'Contact',
    
    // Settings
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.markAllRead': 'Mark all read',
    'notifications.clearAll': 'Clear all',
    'notifications.empty': 'No notifications yet',
    'notifications.settings.title': 'Notification settings',
    'notifications.settings.description': 'Configure how and when to receive reminders',
    'notifications.settings.enable': 'Enable notifications',
    'notifications.settings.enableDesc': 'Get reminders to keep your habit going',
    'notifications.settings.blocked': 'Notifications are blocked in your browser',
    'notifications.settings.dailyReminder': 'Daily reminder',
    'notifications.settings.dailyReminderDesc': 'Get a daily reminder to complete your practice',
    'notifications.settings.reminderEnabled': 'Enable reminder',
    'notifications.settings.time': 'Time',
    'notifications.settings.streakReminder': 'Streak protection',
    'notifications.settings.streakReminderDesc': 'Get notified if you\'re about to lose your streak',
    'notifications.settings.encouragement': 'Encouragement messages',
    'notifications.settings.encouragementDesc': 'Receive occasional motivational messages',
  },
};

export type TranslationKey = keyof typeof translations['en'];

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations['en'][key] || key;
}
