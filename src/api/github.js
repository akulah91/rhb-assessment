
 export const doSearch=async(keyword,perpage,pageno)=>{
    return new Promise((resolve, reject) => {
        timeoutPromise(10000, new Error('Timed Out!'),
            fetch(`https://api.github.com/search/repositories?per_page=${perpage}&q=${keyword}&page=${pageno}`)).then(res=>res.json()).then(res=>{
                    resolve(res);
                })
                .catch((error) => {
                    resolve({total_count:0,incomplete_results:true})
                })
    });
}
export const timeoutPromise = (timeout, err, promise) => {
    return new Promise(function (resolve, reject) {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
}