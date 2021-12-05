import { useAPIFetcher } from "@hooks/useAPIFetcher";
import { fileRequester } from "@utils/helps/request";
import { DocumentStorage } from "@utils/local-file-sytem";
import { useSWRConfig } from "swr";

class ConfigService {
    _version = 1045;
    key = "__CONFIG";
    shouldShowNotification = true;

    versionUpdateContent = {
        title: "Cập nhật phiên bản 1.0.5_beta.2",
        content: `
•  Thêm nhập liệu: Nguyên nhân, giải pháp, cập nhật trạng thái, xóa lỗi !
        
•  Chỉnh sửa giao diện, trình bày các màn hình hiển thị lỗi.
        `,
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
