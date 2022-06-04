export const useFileInfo = () => {
    const fileSize = size => {
        if(size === 0)
            return '0 B'
        let i = Math.floor( Math.log(size) / Math.log(1024) );
        return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    const minimizationNameLength = (name, maxNameLength, centerSymbols = '...') => { 
        if(name.length >= maxNameLength){
            const sliceUpLength = Math.trunc((maxNameLength - centerSymbols.length) / 2);
            const leftSlice = name.slice(0, sliceUpLength), rightSlice = name.slice(-sliceUpLength);
            return leftSlice + centerSymbols + rightSlice;
        }
        return name;
    }

    return {fileSize, minimizationNameLength};
}