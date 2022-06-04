import styles from './file.module.scss';
import FileLogo from '../../../../assets/img/FileLogo.png'
import { useFileInfo } from '../../../../hooks/fileInfo.hooks';

export const UploadFile = ({file}) => {
    const {fileSize, minimizationNameLength} = useFileInfo();
    return (
        <div className={styles.uploadFile}>
            <div className={styles.uploadFile__progress} style={{width: file.progress + '%'}}></div>
            <div className={styles.uploadFile__logo}><img src={FileLogo} alt="FILELOGO" /></div>
            <div title={file.name} className={styles.uploadFile__name}>{minimizationNameLength(file.name, 30)}</div>
            <div className={styles.uploadFile__date}>{new Date(file.date).toLocaleDateString()}</div>
            <div className={styles.uploadFile__size}>{fileSize(file.size)}</div>
        </div>
    );
}