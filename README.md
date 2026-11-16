# speak-resume-book

柯灿文的交互式简历：一份可以被追问的履历。线上地址：[resume.kecanwen.com](https://resume.kecanwen.com)。

## 本地开发

```bash
npm install
npm run dev
```

## OrbStack 部署

```bash
docker compose up -d --build
```

容器映射本机 `5179` 端口，再由 Cloudflare Tunnel 公开为 `resume.kecanwen.com`。
