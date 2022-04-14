export const notConcurrent = <T>(proc: () => PromiseLike<T>) => {
    let inFlight: Promise<T> | false = false;
    return () => {
        if (!inFlight) {
            inFlight = (async () => {
                try{
                    return await proc();
                } finally{
                    inFlight = false;
                }
            })();
        }
    };
};