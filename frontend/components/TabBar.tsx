import { View, StyleSheet} from 'react-native'
import { tabBar } from '../app/styles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';

export function TabBar ({ state, descriptors, navigation } : BottomTabBarProps) {
    

    
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name; 

                const isFocused = state.index === index;

                const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
                };

                const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
                };
                
                

                return (
                    <TabBarButton 
                        key = {route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName = {route.name}
                        routeParams = {route.params}
                        color= {isFocused ? tabBar.selectedColor : tabBar.textColor}
                        label={label}
                        >

                        </TabBarButton>

                    // <PlatformPressable
                    //     key={route.name}
                    //     href={buildHref(route.name, route.params)}
                    //     accessibilityState={isFocused ? { selected: true } : {}}
                    //     accessibilityLabel={options.tabBarAccessibilityLabel}
                    //     testID={options.tabBarButtonTestID}
                    //     onPress={onPress}
                    //     onLongPress={onLongPress}
                    //     style={styles.tabBarElement}
                    // >
                    //     <Animated.View style={animatedIconStyle}>
                    //         {icon[route.name]({
                    //             color: isFocused ? tabBar.selectedColor : tabBar.textColor,
                    //             focus: isFocused,
                    //             style: styles.tabBarIcon
                    //         })}
                    //     </Animated.View>
                        
                    //     <Text style={{color: isFocused ? tabBar.selectedColor : tabBar.textColor}} >
                    //         {label}
                    //     </Text>
                    // </PlatformPressable>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: 200
    }
})

export default TabBar;