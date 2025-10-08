import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShoeListScreen from "./components/ShoeListScreen";
import AddShoeScreen from "./components/AddShoeScreen";
import EditShoeScreen from "./components/EditShoeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ShoeList"
          screenOptions={{
            headerStyle: { backgroundColor: "#007AFF" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="ShoeList"
            component={ShoeListScreen}
            options={{ title: "Quản Lý Giày" }} 
          />
          <Stack.Screen
            name="AddShoe"
            component={AddShoeScreen}
            options={{ title: "Thêm Sản Phẩm" }}
          />
          <Stack.Screen
            name="EditShoe"
            component={EditShoeScreen}
            options={{ title: "Chỉnh Sửa Sản Phẩm" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}