import LogoPerusahaan from "/assets/img/logoperusahaan.png";
import verify from "/assets/img/verify.png";
import { MapPin } from "lucide-react";
import { ConfifHeaderInfo, HeaderInfoStyle } from "../config/ConfigHeaderInfo";
export const HeaderInfo = ({ nameCabang = "", nameDescription = "" }) => {
  const { header, logo } = ConfifHeaderInfo;
  const styles = HeaderInfoStyle;
  return (
    <>
      <div className={styles.container}>
        <img src={logo.sampul} alt="Sampul" className={styles.sampul} />
        <div className={styles.content.wraepper}>
          <img src={LogoPerusahaan} />
          <div className={styles.content.content}>
            <h1 className={styles.ctx.judul}>
              {nameCabang}
              <img src={verify} className="inline-block ml-2" />
            </h1>
            <p className={styles.ctx.description}>{nameDescription}</p>
            <div className={styles.lokasi}>
              <MapPin size={16} className="w-6 h-6 font-light" />
              <p>{header.location}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
