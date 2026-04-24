"use client";
import type { BundledLanguage } from "@/components/kibo-ui/code-block";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockFiles,
	CodeBlockHeader,
	CodeBlockItem,
	CodeBlockSelect,
	CodeBlockSelectContent,
	CodeBlockSelectItem,
	CodeBlockSelectTrigger,
	CodeBlockSelectValue,
	CodeBlockContent,
} from "@/components/kibo-ui/code-block";
import { Children, isValidElement, type ReactNode } from "react";

interface TabProps {
	language: string;
	filename?: string;
	children: string;
}

const Tab = (_props: TabProps) => null;

interface CodeProps {
	children: ReactNode;
	language?: string;
	filename?: string;
}

const CodeInner = ({ children, language, filename }: CodeProps) => {
	if (language) {
		const data = [
			{
				language,
				filename: filename ?? language,
				code: typeof children === "string" ? children : "",
			},
		];
		return (
			<CodeBlock data={data} defaultValue={language} className="mt-2">
				<CodeBlockHeader>
					<CodeBlockFiles>
						{(item) => (
							<CodeBlockFilename key={item.language} value={item.language}>
								{item.filename}
							</CodeBlockFilename>
						)}
					</CodeBlockFiles>
					<CodeBlockCopyButton />
				</CodeBlockHeader>
				<CodeBlockBody>
					{(item) => (
						<CodeBlockItem
							key={item.language}
							value={item.language}
							lineNumbers={false}
						>
							<CodeBlockContent
								language={item.language as BundledLanguage}
								themes={{
									light: "github-light",
									dark: "github-dark",
								}}
								syntaxHighlighting
							>
								{item.code}
							</CodeBlockContent>
						</CodeBlockItem>
					)}
				</CodeBlockBody>
			</CodeBlock>
		);
	}

	const tabs = Children.toArray(children)
		.filter((child) => isValidElement(child) && child.type === Tab)
		.map((child) => {
			const {
				language,
				filename,
				children: code,
			} = (child as React.ReactElement<TabProps>).props;
			return {
				language,
				filename: filename ?? language,
				code: code ?? "",
			};
		});

	if (!tabs.length) return null;

	return (
		<CodeBlock data={tabs} defaultValue={tabs[0].language} className="mt-2">
			<CodeBlockHeader>
				<CodeBlockFiles>
					{(item) => (
						<CodeBlockFilename key={item.language} value={item.language}>
							{item.filename}
						</CodeBlockFilename>
					)}
				</CodeBlockFiles>
				<CodeBlockSelect>
					<CodeBlockSelectTrigger>
						<CodeBlockSelectValue />
					</CodeBlockSelectTrigger>
					<CodeBlockSelectContent>
						{(item) => (
							<CodeBlockSelectItem key={item.language} value={item.language}>
								{item.language}
							</CodeBlockSelectItem>
						)}
					</CodeBlockSelectContent>
				</CodeBlockSelect>
				<CodeBlockCopyButton />
			</CodeBlockHeader>
			<CodeBlockBody>
				{(item) => (
					<CodeBlockItem
						key={item.language}
						value={item.language}
						lineNumbers={false}
					>
						<CodeBlockContent language={item.language as BundledLanguage}>
							{item.code}
						</CodeBlockContent>
					</CodeBlockItem>
				)}
			</CodeBlockBody>
		</CodeBlock>
	);
};

export const Code = Object.assign(CodeInner, { Tab });
