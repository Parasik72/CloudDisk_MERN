import styles from './file.module.scss';
import FileLogo from '../../../../assets/img/FileLogo.png'

function fileSize(size) {
    if(size === 0)
        return '0 B'
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const checkName = name => {
    if(name.length >= 30){
        const left = name.slice(0, 13), right = name.slice(-13);
        return left + '...' + right;
    }
    return name;
}

export const UploadFile = ({file}) => {
    return (
        <div className={styles.uploadFile}>
            <div className={styles.uploadFile__progress} style={{width: file.progress + '%'}}></div>
            <div className={styles.uploadFile__logo}><img src={FileLogo} alt="FILELOGO" /></div>
            <div title={file.name} className={styles.uploadFile__name}>{checkName(file.name)}</div>
            <div className={styles.uploadFile__date}>{new Date(file.date).toLocaleDateString()}</div>
            <div className={styles.uploadFile__size}>{fileSize(file.size)}</div>
        </div>
    );
}