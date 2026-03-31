const DummyAdmin = Array.from({ length: 520 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  name: "Reivan Elsyafir Pratama",
  email: "bububiba@gmail.com",
  password: "onestep122",
  phone: "08112233445",
  isActive: true,
  avatar: "/assets/img/profile.png", 
}));

export default DummyAdmin;