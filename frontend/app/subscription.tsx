import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { authStyles } from './styles';
import storage from './storage';
import dataHandler from './dataHandler';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import SubscriptionDisplay from '@/components/SubscriptionDisplay';
import HomeButton from '@/components/HomeButton';
import * as Updates from 'expo-updates';
import axios from 'axios';
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

	async function reload() {
		if (__DEV__) {
			window.location.reload();
		} else {
			await Updates.reloadAsync();
		}
	}

	if (loading) {
        return (
            <View style={authStyles.container}>
                <Text style={authStyles.subtitle}>Loading...</Text>
            </View>
        );
    }
    if (!user) {
        return router.replace("/login");
    }

	function getSubscription (subscription_type : 0 | 1) {

		if(subscription_type) {
				//implement payments for subscription;
			}
		(async () => {
			const token = await storage.getValue("token");
			if(!token) { 
				return;
			}

			try {
				const response = await axios.post('http://localhost:5050/api/user/subscription', {
                    subscription_type: subscription_type
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
				if(response.status == 200) {
					await storage.remove("user");

				}
			}
			catch (e) {
				console.error(e);
			}
			finally {
				await reload();
			}
		})()
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
						<Text><Link href='/' style={authStyles.link}>Upgrade to Premium</Link> and gain:</Text>
					)}
				</>
				
			): (
				<>
					<Text style={styles.subscriptionTitle}>Choose your subscription</Text>
					<SubscriptionDisplay sub={{subscription_type: 1}} displayBenefits={true}/>
					<TouchableOpacity onPress={() => {getSubscription(0)}}>
						<SubscriptionDisplay sub={{subscription_type: 0}} displayBenefits={true}/>
					</TouchableOpacity>
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
