import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet} from 'react-native';

export default function SubscriptionDisplay ({sub, displayBenefits = false}: {sub: any, displayBenefits? :boolean}) {
    const styles = createStyles(displayBenefits);
    if (!sub || sub.subscription_type == 0) {
        return (
            <View style={styles.subscription}>
                <Text style={styles.subscriptionTitle}>Free subscription</Text>
                {displayBenefits && (
                    <Text style={{textAlign: 'center'}}>Basic functionalities</Text>
                )}
            </View>
        );
    }
    else if(sub.subscription_type == 1) {
        return (
            <LinearGradient
                colors={['#39d5b8', '#22b005']}
                start={{x: 0.85, y: 0.85}}
                end={{x: 0.15, y: 0.15}}
                style={[styles.subscription]}
            >
                <Text style={[styles.subscriptionTitle, {fontWeight: 'bold', color: '#fff'}]}>Premium subscription</Text> {/* fajne efekty, pogrubienie, jakis gradient */}
                {displayBenefits ? (
                    <Text style={{textAlign: 'center', color: '#fff'}}>You gain:</Text>
                ): (
                    <Text style={{textAlign: 'right', color: '#fff'}}>Expires in: {sub.expire_date ? sub.expire_date : 'Lifetime!'}</Text>
                )}
            </LinearGradient>
        )
    }
}

const createStyles = (displayBenefits :boolean) => StyleSheet.create({
    subscription: {
        width: 250,
        padding: 20,
        marginBottom: 30,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
        elevation: 5,
        minHeight: displayBenefits ? 200 : 100,
        justifyContent: 'space-around'
    },
    subscriptionTitle: {
        textAlign: 'center',
        fontSize: 18, 
        marginBottom: 10
    }
})