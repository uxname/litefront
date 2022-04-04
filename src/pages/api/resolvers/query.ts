const resolvers = {
    Query: {
        debug: () => {
            console.log('debug query log');
            return {
                appName: 'LiteFront',
                appVersion: '1.0.0',
                serverTime: new Date().toISOString(),
                uptime: process.uptime()
            };
        }
    }
};

export default resolvers;
