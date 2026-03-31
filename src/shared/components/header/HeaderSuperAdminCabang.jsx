import {
  ConfigSuperAdminCabang,
  ConfigSuperAdminCabangStyle,
} from "@/shared/config/Superadmin/ConfigHeaderSuperadmin";
export const HeaderSuperAdminCabang = ({ namaCabang = "" }) => {
  const { logo, company } = ConfigSuperAdminCabang;
  const style = ConfigSuperAdminCabangStyle;
  return (
    <>
      <div className={style.container}>
        <div className={style.header.wrapper}>
          <div className={style.header.conten}>
            <img src={logo.src} alt={logo.alt} className={style.logo.image} />
            <div className={style.title.wrapper}>
              <h1 className={style.content.text}>{company.text}</h1>
              <h2 className={style.content.cabang}>{namaCabang}</h2>
            </div>   
          </div>
        </div>
      </div>
    </>
  );
};
