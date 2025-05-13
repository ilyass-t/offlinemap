import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "../../components/CustomDrawerContent";

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            headerTitle: "Home",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
              name="declareTraffic"
              options={{
                  drawerLabel: "Declare Traffic",
                  headerTitle: "Declare Traffic",
                  drawerIcon: ({ size, color }) => (
                      <Ionicons name="car-outline" size={size} color={color} />
                  ),
              }}
          />
        <Drawer.Screen
          name="download"
          options={{
            drawerLabel: "Downloaded Maps",
            headerTitle: "Your Downloaded Maps",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="download-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            headerTitle: "Settings",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="help"
          options={{
            drawerLabel: "Help & Feedback",
            headerTitle: "Help & Feedback",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="help-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            headerTitle: "My profile",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="importMap"
          options={{
            drawerLabel: "Import Map",
            headerTitle: "Import Map",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="cloud-upload-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="trafficLayer"
          options={{
            drawerLabel: "Traffic Layer",
            headerTitle: "Traffic Layer",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="car-outline" size={size} color={color} />
            ),
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
