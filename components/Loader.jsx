import { ActivityIndicator } from "react-native";
import COLORS from "../constants/colors";

export default function Loader({ size = "large" }) {
  return (
    <ActivityIndicator
      size={size}
      color={COLORS.primary}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    />
  );
}
