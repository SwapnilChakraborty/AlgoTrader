const { authOptions } = require('./src/lib/auth');
console.log('Providers:', authOptions.providers.map(p => p.id));
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('NextAuth URL:', process.env.NEXTAUTH_URL);
