import { Link, Stack } from "expo-router";
import { Settings } from "lucide-react-native";
import { View } from "react-native";
import { TodosPage } from "@/pages/todos";
import * as m from "@/shared/lib/i18n/messages";
import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";

export default function Index() {
	return (
		<>
			<Stack.Screen
				options={{
					title: m.ago_fun_guppy_shine(),
					headerTransparent: true,
					headerBlurEffect: "dark",
					headerRight: () => (
						<Link href="/settings" asChild>
							<Button size="icon" variant="ghost">
								<Icon as={Settings} />
							</Button>
						</Link>
					),
				}}
			/>
			<View className="flex-1 relative pt-28 px-4">
				<TodosPage />
			</View>
		</>
	);
}
