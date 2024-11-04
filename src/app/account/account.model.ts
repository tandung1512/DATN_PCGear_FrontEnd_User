// src/app/account/account.model.ts
export interface Account {
    id: string;          // Custom ID
    name: string;        // Tên người dùng
    password: string;    // Mật khẩu
    phone: string;       // Số điện thoại
    email: string;       // Địa chỉ email
    address: string;     // Địa chỉ
    image: string;       // Hình ảnh đại diện
    admin: boolean;      // Quyền quản trị
    status: boolean;     // Trạng thái người dùng
    confirm: boolean;    // Xác nhận
    otp?: string | null; // Mã OTP (tùy chọn)
  }
  