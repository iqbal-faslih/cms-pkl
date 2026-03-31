import Card from "../../../../components/cards/Card";
import Badge2 from "../../../../shared/components/Badge2";
import RoundedProfile from "../../../../shared/components/RoundedProfile";
import BackHeader from "../../../../shared/components/header/BackHeader";

const DetailPesertaProfileCard = ({ profile }) => (
  <Card className="rounded-2xl mb-4 p-6 bg-[#f4f5f7]">
    <div className="flex items-center gap-4 mb-8">
      <BackHeader title="Detail Peserta" backTo="/perusahaan/peserta" />
    </div>

    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10">
      <div className="flex-shrink-0">
        <RoundedProfile
          image={profile.profileImage}
          size="140px"
          borderColor="#306BFF"
          fallbackImage={null}
        />
      </div>

      <div className="w-full pt-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl leading-none font-bold text-gray-900">{profile.name}</h2>
            <Badge2
              rounded="20px"
              textSize="11px"
              color="#4281FF"
              className="px-3 py-1 text-white"
            >
              {profile.role}
            </Badge2>
          </div>
          <h4 className="text-lg leading-none text-gray-700 font-medium">
            {profile.school} <span className="mx-2">|</span> {profile.identifier}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
          {profile.fields.map((field) => (
            <div key={field.key}>
              <p className="font-bold text-gray-800 text-sm mb-1">{field.label}</p>
              <p
                className={`text-gray-500 font-medium ${
                  field.key === "email" ? "truncate" : ""
                } ${field.key === "perusahaan" ? "uppercase" : ""}`}
              >
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default DetailPesertaProfileCard;
