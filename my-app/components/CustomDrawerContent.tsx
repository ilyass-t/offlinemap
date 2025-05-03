import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View,Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomDrawerContent(props: any){
    const router = useRouter();
    const { top,bottom } =useSafeAreaInsets();
    return (
        <View style={{ flex:1 }}>
            <DrawerContentScrollView {...props}
            scrollEnabled={false}
            contentContainerStyle={{backgroundColor: '#dde3fe'}}
            >
            <DrawerItemList {...props}/>
            
            
            </DrawerContentScrollView>
            <View 
                style={{
                    borderTopColor:'#dde3fe',
                    borderTopWidth: 1,
                    padding: 20, 
                    paddingBottom: 20+bottom,
                }}
            >
                <Text>Footer</Text>
            </View>


        </View>
    
    );
}