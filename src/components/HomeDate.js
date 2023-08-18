import { View, Text } from "react-native";

export default function HomeDate({ dayName, formattedDate }) {
  return (
    <View className="bg-[#0B646B] w-full py-5 px-4  rounded-xl mb-3">
      <Text className="text-4xl  font-black text-white">{dayName}</Text>
      <Text className="text-lg font-bold text-white">{formattedDate}</Text>
    </View>
  );
}