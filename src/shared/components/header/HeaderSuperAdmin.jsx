import { MapPin } from "lucide-react";
import {
  HeaderConfigSuperAdmin,
  HeaderSuperAdminStyle,
} from "@/shared/config/Superadmin/ConfigHeaderSuperadmin";
import LogoPower from "/assets/img/group.png";
import logoVerify from "/assets/img/verify.png";
export const HeaderSuperAdmin = ({
  userName = "",
  onButtonClick,
  onNavigationClick,
  activeMenu = "",
  itemIsActive = false,
}) => {
  const { company, greeting, navigation, button } = HeaderConfigSuperAdmin;
  const styles = HeaderSuperAdminStyle;

  const navItems = navigation.map((item) => ({
    ...item,
    isActive: activeMenu === item.id,
  }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header.wrapper}>
          <div className={styles.header.contet}>
            <img
              src={company.logo}
              className={styles.logo.image}
              alt="Foto Logo"
            />
            <div className={styles.text.wrapper}>
              <h2 className={styles.text.greeting}>
                {greeting.prexix} {userName}! {greeting.suffix}
              </h2>
              <h1 className={styles.text.compay}>
                {company.name}
                <img src={logoVerify} width={25} className={styles.text.logo} />
              </h1>
              <div className={styles.text.location}>
                <MapPin size={20} className="w-6 h-6" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
        <div className={`${styles.button.wrapper}`}>
          <span
            className={
              itemIsActive ? styles.button.labelActive : styles.button.labelInactive
            }
          >
            {itemIsActive ? "Aktif" : "Nonaktif"}
          </span>

          <div
            className={itemIsActive ? styles.button.active : styles.button.inactive}
            onClick={onButtonClick}
          >
            <div
              className={
                itemIsActive
                  ? styles.button.circleActive
                  : styles.button.circleInactive
              }
            />
          </div>
        </div>
        </div>

        <nav className={styles.navigation.wrapper}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigationClick?.(item.path)}
              className={
                item.isActive
                  ? styles.navigation.active
                  : styles.navigation.inactive
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

      </div>
    </>
  );
};
