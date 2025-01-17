import { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { ICategoryRecipeType } from "@/types";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

interface EditCategoryProps {
	closeModal: () => void;
	category: ICategoryRecipeType;
}

export default function EditCategory({
	closeModal,
	category,
}: EditCategoryProps) {
	const { session } = useSession();
	const { putRequest, loading, error } = useAPI();

	const [form, setForm] = useState({
		name: category.name || "",
	});

	const handleChange = (field: string, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		const formData = {
			name: form.name,
		};

		console.log("FormData being sent:", formData);
		console.log("Category ID:", category._id);

		putRequest(
			`${process.env.EXPO_PUBLIC_DEV_URL}recipes-categories/${category._id}`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${session}`,
					"Content-Type": "application/json",
				},
			},
			(response) => {
				console.log(response);
				closeModal();
			}
		);
	};

	if (loading) {
		return (
			<ActivityIndicator animating color={MD2Colors.red800} size="large" />
		);
	}

	return (
		<View>
			<Text>Name</Text>
			<TextInput
				style={styles.input}
				placeholder="Category Name"
				value={form.name}
				onChangeText={(value) => handleChange("name", value)}
			/>

			<Button title="Submit" onPress={handleSubmit} />
			<Button title="Cancel" onPress={closeModal} />
			{error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 10,
		borderWidth: 1,
		padding: 10,
	},
	error: {
		color: "red",
		margin: 10,
	},
});
