export type PriorityLevel = "low" | "medium" | "high";

export type Todo = {
	// --- DỮ LIỆU CỐT LÕI ---
	id: string;
	title: string;
	isCompleted: boolean;

	// --- THÔNG TIN CHI TIẾT ---
	description?: string;
	priority?: PriorityLevel;

	tagIds: string[];

	// 📅 KẾ HOẠCH & THỜI GIAN
	targetDate?: number; // NGÀY THỰC HIỆN: Chính là trường bạn cần để filter (VD: Lên lịch làm vào thứ 6 tuần này).
	dueDate?: number; // HẠN CHÓT: Deadline thực sự của công việc.

	// ⏰ NHẮC NHỞ (REMINDER)
	reminderAt?: number; // THỜI ĐIỂM NHẮC: Hẹn giờ chuông kêu (Timestamp).
	notificationId?: string; // ID THÔNG BÁO: Rất quan trọng! Lưu lại ID của hệ điều hành để nếu user xóa/hoàn thành Todo thì mình gọi hàm hủy báo thức đi.

	// --- HỆ THỐNG ---
	createdAt: number;
	updatedAt?: number;
};
