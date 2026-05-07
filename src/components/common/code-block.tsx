"use client";
import { Children, isValidElement, type ReactNode } from "react";
import type { BundledLanguage } from "@/components/kibo-ui/code-block";
import {
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
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
} from "@/components/kibo-ui/code-block";

interface TabProps {
	children: string;
	filename?: string;
	language: string;
}

const Tab = (_props: TabProps) => null;

interface CodeProps {
	children: ReactNode;
	filename?: string;
	language?: string;
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
			<CodeBlock className="mt-2" data={data} defaultValue={language}>
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
							lineNumbers={false}
							value={item.language}
						>
							<CodeBlockContent
								language={item.language as BundledLanguage}
								syntaxHighlighting
								themes={{
									light: "github-light",
									dark: "github-dark",
								}}
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

	if (!tabs.length) {
		return null;
	}

	return (
		<CodeBlock className="mt-2" data={tabs} defaultValue={tabs[0].language}>
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
						lineNumbers={false}
						value={item.language}
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
