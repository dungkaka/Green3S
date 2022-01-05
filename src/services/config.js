import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { fileRequester } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";
import { useSWRConfig } from "swr";

class ConfigService {
    _version = 1400;
    _versionText = "1.4";
    key = "__CONFIG";
    shouldShowNotification = true;

    versionUpdateContent = {
        title: `Cập nhật phiên bản ${this._versionText}`,
        content: [
            {
                version: "1.4",
                content: [
                    {
                        text: `•   Cải thiện tương tác.
Tổng quan lỗi, Dashboard: Vuốt màn hình xuống để làm mới dữ liệu`,
                        strong: true,
                    },
                    {
                        text: `•   Cải thiện hiệu năng\n`,
                        space: 0,
                    },
                    { text: `1.4-beta_3` },
                    {
                        text: `•   Thêm Setting PV & Hướng && Bóng che trong chi tiết thiết bị`,
                        strong: true,
                        red: true,
                        space: 0,
                    },

                    { text: `•   Sửa lỗi crash app trong lỗi interver\n`, space: 0 },
                    {
                        text: `1.4-beta_2`,
                    },
                    { text: `•   Sửa lỗi hiển thị điện áp pha trong chi tiết thiết bị`, space: 0 },
                    { text: `•   Cho phép thêm nhiều string trong lỗi tiềm ẩn`, strong: true, red: true, space: 0 },
                    {
                        text: `•   Thêm ảnh trong cập nhật lỗi (AC, DC, Inverter, Hiệu suất)\n`,
                        strong: true,
                        red: true,
                        space: 0,
                    },
                    { text: `1.4-beta_1` },
                    { text: `•   Chuyển tới trang Tổng quan lỗi khi click vào thông báo`, strong: true, space: 0 },
                ],
            },
            {
                version: "1.3",
                content: [
                    {
                        text: `•   Thêm lỗi tiềm ẩn: 
    - Cho phép thêm ảnh trực tiếp từ camera
    - Cho phép thêm nhiều ảnh`,
                        strong: true,
                    },

                    { text: `•   Thêm phân tích PV trong thiết bị`, strong: true, red: true },

                    { text: `•   Sửa lỗi hiển thị trạng thái không chính xác trong chi tiết thiết bị` },

                    { text: `•   Chỉnh sửa lại giao diện phân quyền cho Employee (thêm lối tắt)` },

                    { text: `•   Sửa lỗi crash (thoát) app` },
                ],
            },
            {
                version: "1.2",
                content: [
                    {
                        text: `•   Cập nhật phân quyền. Các tài khoản Admin và Employee cần phải đăng nhập lại để cập nhật các chức năng có sự phân quyền`,
                        red: true,
                        strong: true,
                    },
                ],
            },
        ],
    };

    initData = {
        version: 1,
    };

    requestData = fileRequester({
        requestFunc: () => DocumentStorage.readAsync("app", "config"),
        handleData: (data) => data,
    });

    useConfig = () => {
        const { data, error } = useAPIFetcher(
            this.key,
            {
                revalidateIfStale: false,
                // fallbackData: this.initData,
            },
            this.requestData
        );

        return {
            version: data?.version,
        };
    };

    useConfigControl = () => {
        const { cache, mutate } = useSWRConfig();

        const initConfig = async () => {
            // await DocumentStorage.deleteAsync("app", "config");
            // cache.delete(this.key);
            try {
                const data = await this.requestData();
                cache.set(this.key, data);
            } catch (e) {
                if (e.code == 404) {
                    updateConfig(this.initData);
                }
            }
        };

        const updateConfig = (config) => {
            mutate(
                this.key,
                async (data = this.initData) => {
                    const newConfig = { ...data, ...config };
                    await DocumentStorage.writeAsync("app", "config", newConfig);
                    return newConfig;
                },
                false
            );
        };

        return {
            initConfig,
            updateConfig,
        };
    };
}

export const configService = new ConfigService();
