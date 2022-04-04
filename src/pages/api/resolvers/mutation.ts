const mutation = {
    Mutation: {
        echo: (_parent: unknown, args: { text: string }) => {
            console.log({args});
            return args.text;
        }
    }
};

export default mutation;
