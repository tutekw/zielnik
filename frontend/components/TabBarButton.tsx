import { View, Text, Platform, StyleSheet } from 'react-native'
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { tabBar } from '../app/styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'
import { useEffect } from 'react';

const TabBarButton = ({onPress, onLongPress, isFocused, routeName, routeParams, color, label}: {onPress:Function, onLongPress:Function, isFocused:boolean, routeName:string, routeParams:any, color:string, label:string}) => {
    const scale = useSharedValue(0);
    const { buildHref } = useLinkBuilder();
    const icon :any = {
        index: (props: any) => (<FontAwesome5 name={props.focus ? 'house-user' : 'home'}  size = {tabBar.iconSize} {...props} />),
        map: (props: any) => (<FontAwesome5 name={props.focus ? 'map-marked-alt' : 'map'} size = {tabBar.iconSize} {...props} />),
        login: (props: any) => (<FontAwesome5 name={props.focus ? 'map-marked-alt' : 'map'} size = {tabBar.iconSize} {...props} />),
        signup: (props: any) => (<FontAwesome5 name={props.focus ? 'map-marked-alt' : 'map'} size = {tabBar.iconSize} {...props} />),
        user: (props: any) => (<FontAwesome5 name={props.focus ? 'map-marked-alt' : 'map'} size = {tabBar.iconSize} {...props} />)
    }
    useEffect(() => {
        scale.value = withSpring( 
            isFocused ? 1 : 0, {damping: 10, stiffness: 150}
        );
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);

        return {
            transform: [{
                scale: scaleValue
            }]
        }
    });
    return (
        <PlatformPressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarElement}
            href={buildHref(routeName, routeParams)}
        >
            
            <Animated.View style={[styles.tabBarIcon, animatedIconStyle]}>
                {icon[routeName]({
                    color: isFocused ? tabBar.selectedColor : tabBar.textColor,
                    focus: isFocused,
                })}
            </Animated.View>
            
            <Text style={{color: isFocused ? tabBar.selectedColor : tabBar.textColor}} >
                {label}
            </Text>
        </PlatformPressable>
    )
}

const styles = StyleSheet.create({
        tabBarElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 70,
        borderRadius: 20
        
    },
    tabBarIcon: {
        display: "flex",
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    }
})
export default TabBarButton;