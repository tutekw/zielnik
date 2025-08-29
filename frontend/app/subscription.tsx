import { Text, View, StyleSheet } from 'react-native';
import { authStyles } from './styles';
import storage from './storage';
import dataHandler from './dataHandler';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import SubscriptionDisplay from '@/components/SubscriptionDisplay';
import HomeButton from '@/components/HomeButton';

export default function Subscriptions() {
	const router = useRouter();

	useEffect(() => {
		fetchData();
	}, []);

	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<any>(null)
	const [hasSubscription, setSubscriptionStatus] = useState<boolean>(false)
	const fetchData = async () => {
		try {
			const user = await dataHandler.getUser();
			if(user) {
				setUser(user);
				if(user.subscription) setSubscriptionStatus(true);
			}
		} catch (err) {
			console.error("Error getting user data: ", err);
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
        return (
            <View style={authStyles.container}>
                <Text style={authStyles.subtitle}>Loading profile...</Text>
            </View>
        );
    }
    if (!user) {
        return router.replace("/login");;
    }

  	return (
		<View style={authStyles.container}>
			<Text style={authStyles.title}>Manage your subscription</Text>
			<Text style={authStyles.subtitle}>{user.mail}</Text>
			{hasSubscription ? (
				<>
					<Text style={styles.subscriptionTitle}>Current subscription</Text>
					<SubscriptionDisplay sub={user.subscription}/>

					{user.subscription.subscription_type == 1 ? (
						<Text><Link href='/' style={authStyles.link}>Cancel</Link> and switch to Free</Text>
					): (
						<Text>Upgrade to Premium and gain:</Text>
					)}
				</>
				
			): (
				<>
					<Text style={styles.subscriptionTitle}>Choose your subscription</Text>
					<SubscriptionDisplay sub={{subscription_type: 1}} displayBenefits={true}/>
					<SubscriptionDisplay sub={{subscription_type: 0}} displayBenefits={true}/>
				</>
			)}
			{/* horizontal rectangles one under another with subscription choice */}
			<HomeButton></HomeButton>
		</View>
  	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
	subscriptionTitle: {
		marginBottom: 20,
		fontSize: 18,
		marginTop: 20,
	}
});
